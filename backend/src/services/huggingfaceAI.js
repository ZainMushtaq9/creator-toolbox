// Hugging Face Inference Providers client — OPTIONAL FALLBACK only.
// Used only when AI_PROVIDER=huggingface AND HF_API_TOKEN is configured.
// Never the default: a FREE HF account gets ZERO included Inference
// Providers credits (official pricing page, 2026-11-05 — "Free users can
// use Inference Providers by purchasing credits, or by upgrading to
// PRO"; PRO is $9/mo for $2 credits; the old "$0.10/month free credit"
// is stale, removed ~15 Oct 2026). Live GET /v1/models returned 126
// chat models, ZERO with is_free: true. The only genuinely free way
// through HF is BYOK (an upstream provider's own key in HF settings) —
// but that adds a hop for no benefit over calling the provider directly.
// Base: https://router.huggingface.co/v1 — OpenAI-compatible,
// CHAT COMPLETIONS ONLY. Model IDs are Hub IDs with a routing suffix:
// :fastest (default), :cheapest, :preferred, or :<provider>.
//   - Instruction: openai/gpt-oss-120b (131,072 ctx, not gated,
//     Apache-2.0). Cheaper alt: openai/gpt-oss-20b.
//   - Long-context: deepseek-ai/DeepSeek-V4.1-Flash (1,048,576 ctx).
//     Alt: zai-org/GLM-5.3-Flash (1,048,576 ctx).
//   - Embeddings: NOT on the /v1 surface — task-specific
//     feature-extraction API with BAAI/bge-m3 (1024-dim, multilingual).
//     Alt: Qwen/Qwen3-Embedding-0.6B. Embedding per-token prices
//     UNVERIFIED — do not invent.
// Avoid gated models without separate approval: meta-llama/Llama-3.3-70B-
// Instruct and meta-llama/Llama-4-Scout-17B-16E-Instruct are gated
// (manual licence acceptance). No per-minute/RPM limit is published by
// HF — limits come from the upstream provider. Do not invent RPM numbers.
// Secret: HF_API_TOKEN (fine-grained token, ONLY "Make calls to Inference
// Providers" permission). NEVER reuse the 2026-11-04 chat-shared HF token
// (treated as exposed); this token must be separate from the PSX
// project's token. With no token, calls return the labelled dev mock.
import { mockResponse } from "./aiMock.js";

const BASE_URL = "https://router.huggingface.co/v1";
const CHAT_MODEL = "openai/gpt-oss-120b:fastest";
const LONG_CONTEXT_MODEL = "deepseek-ai/DeepSeek-V4.1-Flash:fastest";
const EMBEDDING_MODEL = "BAAI/bge-m3";
const TIMEOUT_MS = 30000;
const MAX_OUTPUT_CHARS = 4000;

export function modelForHuggingFaceTask(task) {
  if (task === "keywordClustering") return { model: EMBEDDING_MODEL, kind: "embedding", enabled: true };
  if (task === "longContext") return { model: LONG_CONTEXT_MODEL, kind: "instruct", enabled: true };
  return { model: CHAT_MODEL, kind: "instruct", enabled: true };
}

export async function callHuggingFaceChat(env, { task, prompt, maxTokens = 800, fetchImpl = fetch }) {
  const key = env?.HF_API_TOKEN;
  const model = task === "longContext" ? LONG_CONTEXT_MODEL : CHAT_MODEL;
  if (!key) {
    return {
      mode: "mock",
      provider: "huggingface",
      model: null,
      text: mockResponse(task === "longContext" ? "seoAnalysis" : task, { topic: prompt }),
      note: "DEV MOCK — Hugging Face Inference Providers is NOT CONNECTED (no HF_API_TOKEN Worker secret). A free HF account includes zero Inference Providers credits — calls need purchased credits, PRO ($9/mo for $2 credits), or a BYOK upstream key. This mock is deterministic template text, not AI output.",
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
          model,
          messages: [
            { role: "system", content: "You are an SEO assistant for CreatorToolbox. Answer concisely, only from the evidence given, and say when you are unsure. Never invent search volume, rankings or traffic." },
            { role: "user", content: String(prompt).slice(0, 100000) },
          ],
          max_tokens: Math.min(maxTokens, 1200),
          temperature: 0.3,
        }),
        signal: controller.signal,
      });
    } finally { clearTimeout(timer); }
  } catch (e) {
    return { mode: "error", provider: "huggingface", model, error: e?.name === "AbortError" ? "Hugging Face request timed out (30s)." : `Hugging Face request failed: ${e?.message || "network error"}`, fallback: mockResponse(task, { topic: prompt }) };
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const msg = res.status === 402
      ? "Hugging Face returned 402: no Inference Providers credits. Purchase credits, upgrade to PRO, or add a BYOK upstream key in HF settings."
      : res.status === 401
        ? "Hugging Face returned 401: the HF_API_TOKEN is missing or invalid. Use a fine-grained token with only the Inference Providers permission."
        : `Hugging Face returned HTTP ${res.status}. ${detail.slice(0, 200)}`;
    return { mode: "error", provider: "huggingface", model, error: msg, fallback: mockResponse(task, { topic: prompt }) };
  }
  const data = await res.json().catch(() => null);
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    return { mode: "error", provider: "huggingface", model, error: "Hugging Face returned an empty or malformed response.", fallback: mockResponse(task, { topic: prompt }) };
  }
  return { mode: "live", provider: "huggingface", model, text: text.slice(0, MAX_OUTPUT_CHARS), note: `Live Hugging Face result from ${model}. Verify it against the audit evidence before acting on it.` };
}

export async function callHuggingFaceEmbeddings(env, { input, fetchImpl = fetch }) {
  const key = env?.HF_API_TOKEN;
  if (!key) {
    return { mode: "unavailable", provider: "huggingface", model: null, error: "Hugging Face Inference Providers is NOT CONNECTED (no HF_API_TOKEN). Keyword clustering falls back to local Jaccard clustering." };
  }
  const texts = (Array.isArray(input) ? input : [input]).map(String).slice(0, 100);
  let res;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      res = await fetchImpl(`https://router.huggingface.co/hf-inference/models/${EMBEDDING_MODEL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({ inputs: texts, options: { wait_for_model: true } }),
        signal: controller.signal,
      });
    } finally { clearTimeout(timer); }
  } catch (e) {
    return { mode: "error", provider: "huggingface", model: EMBEDDING_MODEL, error: `Hugging Face embeddings request failed: ${e?.message || "network error"}` };
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { mode: "error", provider: "huggingface", model: EMBEDDING_MODEL, error: `Hugging Face embeddings failed (HTTP ${res.status}). ${detail.slice(0, 200)}` };
  }
  const data = await res.json().catch(() => null);
  if (!Array.isArray(data)) return { mode: "error", provider: "huggingface", model: EMBEDDING_MODEL, error: "Hugging Face returned an invalid embeddings response." };
  return { mode: "live", provider: "huggingface", model: EMBEDDING_MODEL, embeddings: data };
}
