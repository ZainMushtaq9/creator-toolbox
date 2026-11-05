// AI model configuration — DEFAULT provider is Cloudflare Workers AI
// (2026-11-05, after the 13-source free-API research in
// docs/free-api-research-2026-11-05.md). AnyRouter, Groq and NVIDIA are
// OPTIONAL FALLBACKS only — never the default.
//
// Workers AI — verified facts (Cloudflare docs):
//   - Native binding: env.AI.run(model, input). NO key, NO card, NO new
//     account — it uses the Cloudflare account the Worker runs on.
//     Binding in wrangler.toml: [ai] binding = "AI".
//   - Free limit: 10,000 Neurons/day per account, recurring FOREVER,
//     resets 00:00 UTC. Overage on the Free plan stops with an error.
//   - Instruction LLM: @cf/meta/llama-4-scout-17b-16e-instruct
//     (131K served context).
//   - Embeddings: @cf/baai/bge-m3 (1024-dim, multilingual,
//     ~1,075 neurons/1M tokens).
//   - Long-context runner-up on Workers AI is the Qwen3.8-27B family
//     (262K) — the EXACT model ID was not confirmed against the live
//     Cloudflare catalog, so no Qwen model ID is wired here. Confirm it
//     against the catalog before adding one.
// Long-context overflow — Google AI Studio (only when input exceeds the
// Workers AI window):
//   - gemini-2.5-flash, up to 1M tokens context. Free tier, no card.
//   - Key from aistudio.google.com → Worker secret GEMINI_API_KEY.
//   - Exact Gemini RPM/RPD are NOT published by Google — do not invent
//     a number; check the AI Studio rate-limit page.
// Fallbacks (each behind its own Worker secret, only if the user supplies
// a key; otherwise the labelled dev mock is returned):
//   - AnyRouter: anyrouter/free, ANYROUTER_API_KEY (sk-ar-v1-…). Free plan
//     is only a 5-request LIFETIME trial; then Go $2/mo or a donated BYOK
//     key. Paid models without credits return 402.
//   - Groq: openai/gpt-oss-120b, GROQ_API_KEY (gsk_…), 30 RPM,
//     1,000 req/day, 200,000 tokens/day. No embeddings.
//   - NVIDIA: NVIDIA_API_KEY (nvapi-…), trial-only terms.
// DO NOT WIRE: GitHub Models (retired 2026-07-30, HTTP 410),
// Opencode/Kilo Code (coding agents, not APIs), Ollama Cloud (free plan
// removed), Cerebras (card required), Cohere trial (1,000 calls/mo,
// non-commercial), Vercel AI Gateway (card requirement unresolved).
// Never use the lookalike repo nherx/free-llm-api-resources.
export const AI_MODELS = {
  provider: "workers-ai",
  promptVersion: "v1",
  tasks: {
    seoAnalysis: {
      model: "@cf/meta/llama-4-scout-17b-16e-instruct",
      kind: "instruct",
      enabled: true,
    },
    keywordClustering: {
      model: "@cf/baai/bge-m3",
      kind: "embedding",
      enabled: true,
    },
    competitorAnalysis: {
      model: "@cf/meta/llama-4-scout-17b-16e-instruct",
      kind: "reasoning",
      enabled: true,
    },
    contentGeneration: {
      model: "@cf/meta/llama-4-scout-17b-16e-instruct",
      kind: "instruct",
      enabled: true,
    },
  },
  // Long-context overflow: only when the estimated input exceeds the
  // Workers AI served window (see OVERFLOW_TOKENS in aiProvider.js).
  longContext: {
    provider: "gemini",
    model: "gemini-2.5-flash",
    maxContextTokens: 1_000_000,
    note: "Exact Gemini free-tier RPM/RPD are unpublished — check the AI Studio rate-limit page. Do not invent a number.",
  },
  // Optional fallbacks — used only when AI_PROVIDER names one AND its
  // secret is configured. Never called without a key.
  fallbacks: {
    huggingface: {
      provider: "huggingface",
      baseUrl: "https://router.huggingface.co/v1",
      tasks: {
        seoAnalysis: { model: "openai/gpt-oss-120b:fastest", kind: "instruct", enabled: true },
        keywordClustering: { model: "BAAI/bge-m3", kind: "embedding", enabled: true, note: "Embeddings are NOT on the /v1 surface — feature-extraction API." },
        competitorAnalysis: { model: "openai/gpt-oss-120b:fastest", kind: "reasoning", enabled: true },
        contentGeneration: { model: "openai/gpt-oss-120b:fastest", kind: "instruct", enabled: true },
        longContext: { model: "deepseek-ai/DeepSeek-V4.1-Flash:fastest", kind: "instruct", enabled: true, note: "1,048,576 ctx. Alt: zai-org/GLM-5.3-Flash:fastest." },
      },
      note: "Free HF accounts get ZERO included Inference Providers credits — calls need purchased credits, PRO ($9/mo for $2 credits), or a BYOK upstream key. Gated Llama models (meta-llama/Llama-3.3-70B-Instruct, Llama-4-Scout) are NOT wired.",
    },
    anyrouter: {
      provider: "anyrouter",
      baseUrl: "https://anyrouter.dev/api/v1",
      tasks: {
        seoAnalysis: { model: "anyrouter/free", kind: "instruct", enabled: true },
        keywordClustering: { model: "CONFIGURE_AVAILABLE_EMBEDDING_MODEL", kind: "embedding", enabled: false },
        competitorAnalysis: { model: "anyrouter/free", kind: "reasoning", enabled: true },
        contentGeneration: { model: "anyrouter/free", kind: "instruct", enabled: true },
      },
    },
    groq: {
      provider: "groq",
      baseUrl: "https://api.groq.com/openai/v1",
      tasks: {
        seoAnalysis: { model: "openai/gpt-oss-120b", kind: "instruct", enabled: true },
        keywordClustering: { model: "", kind: "embedding", enabled: false, note: "Groq has no embeddings endpoint." },
        competitorAnalysis: { model: "openai/gpt-oss-120b", kind: "reasoning", enabled: true },
        contentGeneration: { model: "openai/gpt-oss-120b", kind: "instruct", enabled: true },
      },
    },
    nvidia: {
      provider: "nvidia",
      baseUrl: "https://integrate.api.nvidia.com/v1",
      tasks: {
        seoAnalysis: { model: "", suggested: "nvidia/nemotron-3-nano-30b-a3b", kind: "instruct", enabled: false },
        keywordClustering: { model: "", suggested: "nvidia/nemotron-3-embed-1b", kind: "embedding", enabled: false },
        competitorAnalysis: { model: "", suggested: "nvidia/llama-3.1-nemotron-ultra-253b-v1", kind: "reasoning", enabled: false },
        contentGeneration: { model: "", suggested: "nvidia/nemotron-3-nano-30b-a3b", kind: "instruct", enabled: false },
      },
    },
  },
};

export function modelForTask(task, env) {
  const fromEnv = env?.[`WORKERS_AI_MODEL_${task.toUpperCase()}`];
  const cfg = AI_MODELS.tasks[task];
  if (!cfg) return null;
  const model = (fromEnv || cfg.model || "").trim();
  return { ...cfg, model, enabled: Boolean(cfg.enabled && model) };
}
