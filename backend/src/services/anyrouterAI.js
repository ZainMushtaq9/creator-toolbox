// AnyRouter AI client — OPTIONAL FALLBACK provider only (2026-11-05).
// Used only when AI_PROVIDER=anyrouter AND ANYROUTER_API_KEY is set.
// Base: https://anyrouter.dev/api/v1 (OpenAI-compatible).
// Key: Worker secret ANYROUTER_API_KEY only (prefix sk-ar-v1-).
// Pricing truth (from AnyRouter's own docs — do not claim unlimited free):
//   Free plan: $0, no credits, 5-request LIFETIME trial on anyrouter/free.
//   After the trial, free models return 403 free_tier_requires_subscription
//   until the account has Go. Go: $2/mo (Polar charges $2.63) for $4/mo
//   credits, OR free by donating one eligible BYOK key (DeepSeek, Z.ai GLM,
//   Moonshot Kimi). Paid models without credits return 402.
// Output is validated (non-empty string, length cap) before return/storage.
import { AI_MODELS } from "../config/aiModels.js";
import { mockResponse } from "./aiMock.js";

const FALLBACK = AI_MODELS.fallbacks.anyrouter;
const BASE_URL = FALLBACK.baseUrl;

function modelForAnyRouterTask(task, env) {
  const fromEnv = env?.[`ANYROUTER_MODEL_${task.toUpperCase()}`];
  const cfg = FALLBACK.tasks[task];
  if (!cfg) return null;
  const model = (fromEnv || cfg.model || "").trim();
  return { ...cfg, model, enabled: Boolean(cfg.enabled && model && model !== "CONFIGURE_AVAILABLE_EMBEDDING_MODEL") };
}

function interpretStatus(status, detail) {
  if (status === 403 && /free_tier_requires_subscription/i.test(detail)) {
    return "AnyRouter free trial used up (5 requests lifetime on anyrouter/free). Free models now need AnyRouter Go — $2/mo for $4/mo credits, or free by donating an eligible BYOK key (DeepSeek, Z.ai GLM, Moonshot Kimi). See docs/api.md.";
  }
  if (status === 402) {
    return "AnyRouter returned 402: this model needs credits and the account has none. Add credits (Go) or use a free route.";
  }
  if (status === 401) return "AnyRouter returned 401: the ANYROUTER_API_KEY is missing or invalid. Check the Worker secret.";
  if (status === 429) return "AnyRouter rate limit hit (429). Wait and retry; the free route is rate-limited.";
  return `AnyRouter returned HTTP ${status}. ${detail.slice(0, 200)}`;
}

export async function callAnyRouterChat(env, { task, prompt, maxTokens = 800, fetchImpl = fetch }) {
  const cfg = modelForAnyRouterTask(task, env);
  const key = env?.ANYROUTER_API_KEY;
  if (!key || !cfg?.enabled || !cfg.model) {
    return {
      mode: "mock",
      provider: "anyrouter",
      model: null,
      text: mockResponse(task, { topic: prompt }),
      note: "DEV MOCK — AnyRouter is NOT production-connected (no ANYROUTER_API_KEY Worker secret and/or no model configured). Set the secret to get live results. This mock is deterministic template text, not AI output.",
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
    return { mode: "error", provider: "anyrouter", model: cfg.model, error: e?.name === "AbortError" ? "AnyRouter request timed out (15s)." : `AnyRouter request failed: ${e?.message || "network error"}`, fallback: mockResponse(task, { topic: prompt }) };
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { mode: "error", provider: "anyrouter", model: cfg.model, error: interpretStatus(res.status, detail), fallback: mockResponse(task, { topic: prompt }) };
  }
  let data;
  try { data = await res.json(); } catch { return { mode: "error", provider: "anyrouter", model: cfg.model, error: "AnyRouter returned invalid JSON.", fallback: mockResponse(task, { topic: prompt }) }; }
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    return { mode: "error", provider: "anyrouter", model: cfg.model, error: "AnyRouter returned an empty or malformed response.", fallback: mockResponse(task, { topic: prompt }) };
  }
  return { mode: "live", provider: "anyrouter", model: cfg.model, text: text.slice(0, MAX_OUTPUT_CHARS), note: `Live AnyRouter result from ${cfg.model}. Verify it against the audit evidence before acting on it.` };
}

export async function callAnyRouterEmbeddings(env, { input, fetchImpl = fetch }) {
  const cfg = modelForAnyRouterTask("keywordClustering", env);
  const key = env?.ANYROUTER_API_KEY;
  if (!key || !cfg?.enabled || !cfg.model) {
    return { mode: "unavailable", provider: "anyrouter", model: null, error: "No embedding model is configured. Only use an embedding model ID verified in the live GET /v1/models list. Keyword clustering falls back to local Jaccard clustering." };
  }
  const texts = (Array.isArray(input) ? input : [input]).map(String).slice(0, 100);
  let res;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      res = await fetchImpl(`${BASE_URL}/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: cfg.model, input: texts }),
        signal: controller.signal,
      });
    } finally { clearTimeout(timer); }
  } catch (e) {
    return { mode: "error", provider: "anyrouter", model: cfg.model, error: `AnyRouter embeddings request failed: ${e?.message || "network error"}` };
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { mode: "error", provider: "anyrouter", model: cfg.model, error: interpretStatus(res.status, detail) };
  }
  const data = await res.json().catch(() => null);
  if (!Array.isArray(data?.data)) return { mode: "error", provider: "anyrouter", model: cfg.model, error: "AnyRouter returned an invalid embeddings response." };
  return { mode: "live", provider: "anyrouter", model: cfg.model, embeddings: data.data.map((d) => d.embedding) };
}

export async function listAnyRouterModels({ apiKey = null, fetchImpl = fetch } = {}) {
  // GET /v1/models — try with the key when available, without it otherwise.
  // Never invent a model list: on failure, return the configured list only.
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let res;
    try {
      res = await fetchImpl(`${BASE_URL}/models`, {
        signal: controller.signal,
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      });
    } finally { clearTimeout(timer); }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const models = (data?.data || []).map((m) => m.id).filter(Boolean).sort();
    return { source: "live-catalog", count: models.length, models: models.slice(0, 500), checkedAt: new Date().toISOString() };
  } catch (e) {
    return {
      source: "configured-only",
      count: 0,
      models: [],
      warning: `Could not reach the live AnyRouter model catalog (${e?.message || "network error"}). Verify models at anyrouter.dev/models before deploying.`,
      configured: AI_MODELS,
    };
  }
}
