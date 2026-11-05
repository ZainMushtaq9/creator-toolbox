// AI model configuration — DEFAULT provider is Cloudflare Workers AI.
// Native binding env.AI.run(...) — NO key, NO card, NO new account.
// Free limit: 10,000 Neurons/day per account, recurring forever,
// resets 00:00 UTC. Models:
//   - Instruction: @cf/meta/llama-4-scout-17b-16e-instruct (131K ctx)
//   - Embeddings: @cf/baai/bge-m3 (1024-dim, multilingual)
// Long-context overflow: Google AI Studio gemini-2.5-flash (up to 1M ctx),
// free tier, no card, key from aistudio.google.com → GEMINI_API_KEY.
// Exact Gemini RPM/RPD are unpublished — do not invent a number.
// Optional fallbacks: AnyRouter, Groq, NVIDIA (each behind its own secret).
// No API key is stored here. The backend config in
// backend/src/config/aiModels.js is authoritative.
export const AI_MODELS = {
  provider: "workers-ai",
  tasks: {
    seoAnalysis: { model: "@cf/meta/llama-4-scout-17b-16e-instruct", enabled: true },
    keywordClustering: { model: "@cf/baai/bge-m3", enabled: true },
    competitorAnalysis: { model: "@cf/meta/llama-4-scout-17b-16e-instruct", enabled: true },
    contentGeneration: { model: "@cf/meta/llama-4-scout-17b-16e-instruct", enabled: true }
  },
  longContext: {
    provider: "gemini",
    model: "gemini-2.5-flash",
    note: "Overflow only — used when input exceeds the Workers AI window. GEMINI_API_KEY not supplied yet."
  },
  fallbacks: {
    huggingface: { provider: "huggingface", model: "openai/gpt-oss-120b:fastest", note: "Optional fallback only — free HF accounts get zero included Inference Providers credits; needs purchased credits, PRO, or a BYOK key." },
    anyrouter: { provider: "anyrouter", model: "anyrouter/free", note: "Optional fallback only — 5-request lifetime free trial, then Go $2/mo or donated BYOK key." },
    groq: { provider: "groq", model: "openai/gpt-oss-120b", note: "Optional fallback only — 30 RPM, 1,000 req/day, 200K tokens/day; no embeddings." },
    nvidia: { provider: "nvidia", note: "Optional fallback only — trial-only terms." }
  }
};
