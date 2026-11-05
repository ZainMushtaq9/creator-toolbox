// Google AI Studio (Gemini) client — LONG-CONTEXT OVERFLOW ONLY.
// Used only when the input exceeds the Workers AI served window
// (llama-4-scout: 131K tokens). Model: gemini-2.5-flash, up to 1M tokens.
// Free tier, no card, no billing account. Key from aistudio.google.com,
// stored as the Worker secret GEMINI_API_KEY (header x-goog-api-key).
// Exact free-tier RPM/RPD are NOT published by Google — do not invent
// a number; check the AI Studio rate-limit page.
// Free-tier prompts may be used by Google to improve its products —
// never send sensitive user data. With no key, returns "unavailable".
import { AI_MODELS } from "../config/aiModels.js";
import { mockResponse } from "./aiMock.js";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const TIMEOUT_MS = 30000;
const MAX_OUTPUT_CHARS = 4000;

export async function callGeminiChat(env, { task, prompt, maxTokens = 800, fetchImpl = fetch }) {
  const key = env?.GEMINI_API_KEY;
  if (!key) {
    return {
      mode: "unavailable",
      provider: "gemini",
      model: AI_MODELS.longContext.model,
      error: "Long-context overflow is NOT CONNECTED: no GEMINI_API_KEY Worker secret is set. Create a key at aistudio.google.com (free tier, no card) and set it with `wrangler secret put GEMINI_API_KEY`. Shorten the input to fit the Workers AI window, or supply the key.",
      fallback: mockResponse(task, { topic: prompt }),
    };
  }
  let res;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      res = await fetchImpl(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are an SEO assistant for CreatorToolbox. Answer concisely, only from the evidence given, and say when you are unsure. Never invent search volume, rankings or traffic.\n\n${String(prompt).slice(0, 500000)}` }] }],
          generationConfig: { maxOutputTokens: Math.min(maxTokens, 1200), temperature: 0.3 },
        }),
        signal: controller.signal,
      });
    } finally { clearTimeout(timer); }
  } catch (e) {
    return { mode: "error", provider: "gemini", model: AI_MODELS.longContext.model, error: e?.name === "AbortError" ? "Gemini request timed out (30s)." : `Gemini request failed: ${e?.message || "network error"}`, fallback: mockResponse(task, { topic: prompt }) };
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const msg = res.status === 429
      ? "Gemini rate limit hit (429). Exact free-tier limits are unpublished — check the AI Studio rate-limit page."
      : res.status === 400
        ? `Gemini rejected the request (400). ${detail.slice(0, 200)}`
        : `Gemini returned HTTP ${res.status}. ${detail.slice(0, 200)}`;
    return { mode: "error", provider: "gemini", model: AI_MODELS.longContext.model, error: msg, fallback: mockResponse(task, { topic: prompt }) };
  }
  const data = await res.json().catch(() => null);
  const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
  if (!text.trim()) {
    return { mode: "error", provider: "gemini", model: AI_MODELS.longContext.model, error: "Gemini returned an empty or malformed response.", fallback: mockResponse(task, { topic: prompt }) };
  }
  return { mode: "live", provider: "gemini", model: AI_MODELS.longContext.model, text: text.slice(0, MAX_OUTPUT_CHARS), note: `Live Gemini result from ${AI_MODELS.longContext.model} (long-context overflow, up to 1M tokens). Verify it against the audit evidence before acting on it.` };
}
