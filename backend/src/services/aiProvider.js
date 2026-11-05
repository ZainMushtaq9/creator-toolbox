// Provider abstraction for AI calls.
// DEFAULT: Cloudflare Workers AI (env.AI.run, no key, no card —
// 10,000 Neurons/day per account, recurring forever, resets 00:00 UTC).
// LONG-CONTEXT OVERFLOW: Google Gemini (gemini-2.5-flash, up to 1M ctx)
// behind GEMINI_API_KEY — used ONLY when the estimated input exceeds the
// Workers AI served window (llama-4-scout: 131K tokens).
// OPTIONAL FALLBACKS (AI_PROVIDER + their own secret, only if the user
// supplies a key): huggingface, anyrouter, groq, nvidia.
// With no binding/key for the selected provider, every call returns the
// labelled dev mock — never a fake "live" result.
import { AI_MODELS } from "../config/aiModels.js";
import { callWorkersAIChat, callWorkersAIEmbeddings } from "./workersAI.js";
import { callGeminiChat } from "./geminiAI.js";
import { callHuggingFaceChat, callHuggingFaceEmbeddings } from "./huggingfaceAI.js";
import { callAnyRouterChat, callAnyRouterEmbeddings, listAnyRouterModels } from "./anyrouterAI.js";
import { callGroqChat } from "./groqAI.js";
import { callNvidiaChat, listNvidiaModels } from "./nvidiaAI.js";

// Served context of the default Workers AI chat model (131K tokens).
// Overflow threshold leaves headroom for the system prompt + output.
export const OVERFLOW_TOKENS = 100_000;

export function estimateTokens(text) {
  return Math.ceil(String(text || "").length / 4);
}

export function activeProvider(env) {
  return String(env?.AI_PROVIDER || AI_MODELS.provider || "workers-ai").toLowerCase();
}

export async function callAI(env, { task, prompt, maxTokens, fetchImpl } = {}) {
  const provider = activeProvider(env);
  if (provider === "gemini") return callGeminiChat(env, { task, prompt, maxTokens, fetchImpl });
  if (provider === "huggingface") return callHuggingFaceChat(env, { task, prompt, maxTokens, fetchImpl });
  if (provider === "anyrouter") return callAnyRouterChat(env, { task, prompt, maxTokens, fetchImpl });
  if (provider === "groq") return callGroqChat(env, { task, prompt, maxTokens, fetchImpl });
  if (provider === "nvidia") return callNvidiaChat(env, { task, prompt, maxTokens, fetchImpl });
  // Default: Workers AI, with Gemini long-context overflow.
  if (estimateTokens(prompt) > OVERFLOW_TOKENS) {
    return callGeminiChat(env, { task, prompt, maxTokens, fetchImpl });
  }
  return callWorkersAIChat(env, { task, prompt, maxTokens });
}

export async function callEmbeddings(env, { input, fetchImpl } = {}) {
  const provider = activeProvider(env);
  if (provider === "huggingface") return callHuggingFaceEmbeddings(env, { input, fetchImpl });
  if (provider === "anyrouter") return callAnyRouterEmbeddings(env, { input, fetchImpl });
  if (provider === "groq" || provider === "nvidia") {
    return { mode: "unavailable", provider, model: null, error: `${provider === "groq" ? "Groq has no embeddings endpoint" : "NVIDIA embedding fallback is not wired for this task"}. Keyword clustering falls back to local Jaccard clustering.` };
  }
  if (provider === "gemini") {
    return { mode: "unavailable", provider: "gemini", model: null, error: "Gemini embeddings are not wired for keyword clustering. Keyword clustering falls back to local Jaccard clustering." };
  }
  return callWorkersAIEmbeddings(env, { input });
}

export async function listModels(env, { fetchImpl } = {}) {
  const provider = activeProvider(env);
  if (provider === "anyrouter") return listAnyRouterModels({ apiKey: env?.ANYROUTER_API_KEY || null, fetchImpl });
  if (provider === "nvidia") return listNvidiaModels({ fetchImpl });
  // Workers AI / Gemini / Groq: no unauthenticated live catalog is
  // relied on here — return the configured models with a verify note.
  const configured = provider === "gemini"
    ? [AI_MODELS.longContext.model]
    : provider === "groq"
      ? ["openai/gpt-oss-120b"]
      : provider === "huggingface"
        ? ["openai/gpt-oss-120b:fastest", "deepseek-ai/DeepSeek-V4.1-Flash:fastest", "BAAI/bge-m3"]
        : Object.values(AI_MODELS.tasks).map((t) => t.model).filter(Boolean);
  return {
    source: "configured-only",
    count: new Set(configured).size,
    models: [...new Set(configured)],
    note: provider === "workers-ai"
      ? "Verify model IDs against the Cloudflare Workers AI catalog (developers.cloudflare.com/workers-ai) before deploying — the Qwen3.8-27B family (262K) is the long-context runner-up but its exact model ID was not confirmed."
      : "Configured models only — verify against the provider's live catalog before deploying.",
    configured: AI_MODELS,
  };
}
