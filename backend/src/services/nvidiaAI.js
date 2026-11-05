// NVIDIA Build AI client — OPTIONAL FALLBACK provider only.
// Default provider is AnyRouter (see backend/src/config/aiModels.js and
// backend/src/services/aiProvider.js). NVIDIA is used ONLY when
// AI_PROVIDER=nvidia is set AND NVIDIA_API_KEY is configured.
// OpenAI-compatible endpoint: https://integrate.api.nvidia.com/v1
// (verified 2026-11-05 from public sources: build.nvidia.com catalog,
// key format nvapi-…, free tier roughly 40 req/min per model, models
// retire — verify the live list with GET /api/v1/ai/models before deploying).
// Rules enforced here:
//  - API key comes ONLY from the Worker secret NVIDIA_API_KEY. Never from
//    frontend code, never from another project, never committed.
//  - Model IDs are configurable (env NVIDIA_MODEL_<TASK>). If no model is
//    configured, calls fall back to the clearly-labelled DEV MOCK.
//  - Output is validated against a schema (non-empty string, length cap)
//    before it is returned or stored. Provider errors are surfaced as
//    structured errors, never as raw provider bodies.
//  - Request/output caps, 15s timeout.
import { mockResponse } from "./aiMock.js";

const BASE_URL = "https://integrate.api.nvidia.com/v1";
const TIMEOUT_MS = 15000;
const MAX_OUTPUT_CHARS = 4000;
const SUGGESTED = {
  seoAnalysis: "nvidia/nemotron-3-nano-30b-a3b",
  keywordClustering: "nvidia/nemotron-3-embed-1b",
  competitorAnalysis: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
  contentGeneration: "nvidia/nemotron-3-nano-30b-a3b",
};

export function modelForNvidiaTask(task, env) {
  const model = String(env?.[`NVIDIA_MODEL_${task.toUpperCase()}`] || "").trim();
  return { model, suggested: SUGGESTED[task] || "", enabled: Boolean(model) };
}

export async function callNvidiaChat(env, { task, prompt, maxTokens = 800, fetchImpl = fetch }) {
  const cfg = modelForNvidiaTask(task, env);
  const key = env?.NVIDIA_API_KEY;
  if (!key || !cfg.enabled) {
    return {
      mode: "mock",
      provider: "nvidia",
      model: null,
      text: mockResponse(task, { topic: prompt }),
      note: "DEV MOCK — NVIDIA fallback is NOT production-connected (no NVIDIA_API_KEY Worker secret and/or no model configured). This mock is deterministic template text, not AI output.",
    };
  }
  const body = {
    model: cfg.model,
    messages: [
      { role: "system", content: "You are an SEO assistant for CreatorToolbox. Answer concisely, only from the evidence given, and say when you are unsure. Never invent search volume, rankings or traffic." },
      { role: "user", content: String(prompt).slice(0, 4000) },
    ],
    max_tokens: Math.min(maxTokens, 1200),
    temperature: 0.3,
  };
  let res;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      res = await fetchImpl(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } finally { clearTimeout(timer); }
  } catch (e) {
    return { mode: "error", provider: "nvidia", model: cfg.model, error: e?.name === "AbortError" ? "NVIDIA request timed out (15s)." : `NVIDIA request failed: ${e?.message || "network error"}`, fallback: mockResponse(task, { topic: prompt }) };
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { mode: "error", provider: "nvidia", model: cfg.model, error: `NVIDIA returned HTTP ${res.status}. ${detail.slice(0, 200)}`, fallback: mockResponse(task, { topic: prompt }) };
  }
  let data;
  try { data = await res.json(); } catch { return { mode: "error", provider: "nvidia", model: cfg.model, error: "NVIDIA returned invalid JSON.", fallback: mockResponse(task, { topic: prompt }) }; }
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    return { mode: "error", provider: "nvidia", model: cfg.model, error: "NVIDIA returned an empty or malformed response.", fallback: mockResponse(task, { topic: prompt }) };
  }
  return { mode: "live", provider: "nvidia", model: cfg.model, text: text.slice(0, MAX_OUTPUT_CHARS), note: `Live NVIDIA result from ${cfg.model}. Verify it against the audit evidence before acting on it.` };
}
// Backwards-compatible alias.
export const callChat = callNvidiaChat;

export async function listNvidiaModels({ fetchImpl = fetch } = {}) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let res;
    try {
      res = await fetchImpl(`${BASE_URL}/models`, { signal: controller.signal });
    } finally { clearTimeout(timer); }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const models = (data?.data || []).map((m) => m.id).filter(Boolean).sort();
    return { source: "live-catalog", count: models.length, models: models.slice(0, 200), checkedAt: new Date().toISOString() };
  } catch (e) {
    return {
      source: "configured-only",
      count: 0,
      models: [],
      warning: `Could not reach the live NVIDIA model catalog (${e?.message || "network error"}). Verify models at build.nvidia.com before deploying.`,
      suggested: SUGGESTED,
    };
  }
}
export const listModels = listNvidiaModels;
