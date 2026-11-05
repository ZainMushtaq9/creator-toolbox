// Cloudflare Workers AI client — DEFAULT provider (2026-11-05).
// Native binding: env.AI.run(model, input). NO key, NO card, NO new
// account. Free limit: 10,000 Neurons/day per account, recurring forever,
// resets 00:00 UTC. Overage on the Free plan stops with an error.
//   - Chat: @cf/meta/llama-4-scout-17b-16e-instruct (131K served ctx)
//   - Embeddings: @cf/baai/bge-m3 (1024-dim, multilingual)
// Binding in wrangler.toml: [ai] binding = "AI".
// When env.AI is not bound (local node --test, or a Worker deployed
// without the binding), calls return the labelled dev mock — never a
// fake "live" result.
import { AI_MODELS, modelForTask } from "../config/aiModels.js";
import { mockResponse } from "./aiMock.js";

const MAX_OUTPUT_CHARS = 4000;

export async function callWorkersAIChat(env, { task, prompt, maxTokens = 800 }) {
  const cfg = modelForTask(task, env);
  if (!env?.AI || typeof env.AI.run !== "function" || !cfg?.enabled || !cfg.model) {
    return {
      mode: "mock",
      provider: "workers-ai",
      model: null,
      text: mockResponse(task, { topic: prompt }),
      note: "DEV MOCK — Workers AI is NOT production-connected here (the AI binding is not available in this environment). In production the Worker uses env.AI.run with no key. This mock is deterministic template text, not AI output.",
    };
  }
  let out;
  try {
    out = await env.AI.run(cfg.model, {
      messages: [
        { role: "system", content: "You are an SEO assistant for CreatorToolbox. Answer concisely, only from the evidence given, and say when you are unsure. Never invent search volume, rankings or traffic." },
        { role: "user", content: String(prompt).slice(0, 100000) },
      ],
      max_tokens: Math.min(maxTokens, 1200),
      temperature: 0.3,
    });
  } catch (e) {
    return { mode: "error", provider: "workers-ai", model: cfg.model, error: `Workers AI request failed: ${e?.message || "unknown error"} (the free plan stops with an error when the 10,000 Neurons/day allowance is used up).`, fallback: mockResponse(task, { topic: prompt }) };
  }
  const text = typeof out === "string" ? out : out?.response || out?.result || out?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    return { mode: "error", provider: "workers-ai", model: cfg.model, error: "Workers AI returned an empty or malformed response.", fallback: mockResponse(task, { topic: prompt }) };
  }
  return { mode: "live", provider: "workers-ai", model: cfg.model, text: text.slice(0, MAX_OUTPUT_CHARS), note: `Live Workers AI result from ${cfg.model}. Verify it against the audit evidence before acting on it.` };
}

export async function callWorkersAIEmbeddings(env, { input }) {
  const cfg = modelForTask("keywordClustering", env);
  if (!env?.AI || typeof env.AI.run !== "function" || !cfg?.enabled || !cfg.model) {
    return { mode: "unavailable", provider: "workers-ai", model: null, error: "Workers AI binding is not available in this environment. Keyword clustering falls back to local Jaccard clustering." };
  }
  const texts = (Array.isArray(input) ? input : [input]).map(String).slice(0, 100);
  let out;
  try {
    out = await env.AI.run(cfg.model, { text: texts });
  } catch (e) {
    return { mode: "error", provider: "workers-ai", model: cfg.model, error: `Workers AI embeddings failed: ${e?.message || "unknown error"}` };
  }
  const data = out?.data || out?.embeddings;
  if (!Array.isArray(data)) return { mode: "error", provider: "workers-ai", model: cfg.model, error: "Workers AI returned an invalid embeddings response." };
  return { mode: "live", provider: "workers-ai", model: cfg.model, embeddings: data };
}
