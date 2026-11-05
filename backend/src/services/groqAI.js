// Groq client — OPTIONAL FALLBACK provider only (never the default).
// OpenAI-compatible base: https://api.groq.com/openai/v1
// Model: openai/gpt-oss-120b (131,072 ctx). Free plan $0, no card.
// Per-org limits (per Groq docs as summarised Oct 2026): 30 RPM,
// 1,000 req/day, 200,000 tokens/day for this model. Key from
// console.groq.com, prefix gsk_, stored as Worker secret GROQ_API_KEY.
// Groq has NO embeddings endpoint — keyword clustering is not available
// through Groq and falls back to local Jaccard clustering.
// Only called when AI_PROVIDER=groq AND GROQ_API_KEY is configured.
import { mockResponse } from "./aiMock.js";

const BASE_URL = "https://api.groq.com/openai/v1";
const MODEL = "openai/gpt-oss-120b";
const TIMEOUT_MS = 15000;
const MAX_OUTPUT_CHARS = 4000;

export async function callGroqChat(env, { task, prompt, maxTokens = 800, fetchImpl = fetch }) {
  const key = env?.GROQ_API_KEY;
  if (!key) {
    return {
      mode: "mock",
      provider: "groq",
      model: null,
      text: mockResponse(task, { topic: prompt }),
      note: "DEV MOCK — Groq fallback is NOT production-connected (no GROQ_API_KEY Worker secret). This mock is deterministic template text, not AI output.",
    };
  }
  let res;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      res = await fetchImpl(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: "You are an SEO assistant for CreatorToolbox. Answer concisely, only from the evidence given, and say when you are unsure. Never invent search volume, rankings or traffic." },
            { role: "user", content: String(prompt).slice(0, 4000) },
          ],
          max_tokens: Math.min(maxTokens, 1200),
          temperature: 0.3,
        }),
        signal: controller.signal,
      });
    } finally { clearTimeout(timer); }
  } catch (e) {
    return { mode: "error", provider: "groq", model: MODEL, error: e?.name === "AbortError" ? "Groq request timed out (15s)." : `Groq request failed: ${e?.message || "network error"}`, fallback: mockResponse(task, { topic: prompt }) };
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const msg = res.status === 429 ? "Groq rate limit hit (429 — free plan: 30 RPM, 1,000 req/day, 200,000 tokens/day)." : `Groq returned HTTP ${res.status}. ${detail.slice(0, 200)}`;
    return { mode: "error", provider: "groq", model: MODEL, error: msg, fallback: mockResponse(task, { topic: prompt }) };
  }
  const data = await res.json().catch(() => null);
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    return { mode: "error", provider: "groq", model: MODEL, error: "Groq returned an empty or malformed response.", fallback: mockResponse(task, { topic: prompt }) };
  }
  return { mode: "live", provider: "groq", model: MODEL, text: text.slice(0, MAX_OUTPUT_CHARS), note: `Live Groq result from ${MODEL}. Verify it against the audit evidence before acting on it.` };
}
