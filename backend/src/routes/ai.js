// AI routes (Phase 4) — owner-only, require ADMIN_TOKEN.
// Default provider: Cloudflare Workers AI (env.AI.run, no key).
// Long-context overflow: Gemini (gemini-2.5-flash) behind GEMINI_API_KEY.
// Optional fallbacks: AnyRouter, Groq, NVIDIA (each behind its own secret).
// POST /api/v1/ai/recommendations — AI chat (live, or labelled dev mock).
// POST /api/v1/ai/generate — alias for recommendations (outline/content).
// GET  /api/v1/ai/models — live provider catalog check + configured models.
import { z } from "zod";
import { envelope, envelopeError, parseJsonBody, validateBody } from "../utils/envelope.js";
import { isAdmin } from "../security/authentication.js";
import { callAI, listModels, activeProvider } from "../services/aiProvider.js";
import { AI_MODELS } from "../config/aiModels.js";
import { logAiJob } from "../utils/db.js";

const recSchema = z.object({
  task: z.enum(["seoAnalysis", "competitorAnalysis", "contentGeneration"]).default("seoAnalysis"),
  prompt: z.string().min(1).max(4000),
  topic: z.string().max(200).optional(),
});

export async function aiHandler(request, env) {
  if (!isAdmin(request, env)) {
    return envelopeError("unauthorized", "AI endpoints are owner-only. Send a valid Bearer ADMIN_TOKEN (Worker secret).", 401);
  }
  const url = new URL(request.url);
  const path = url.pathname;
  if (path === "/api/v1/ai/models" && request.method === "GET") {
    const live = await listModels(env);
    return envelope({ provider: activeProvider(env), configured: AI_MODELS, live }, { source: live.source === "live-catalog" ? "ai-provider" : "worker" });
  }
  if ((path === "/api/v1/ai/recommendations" || path === "/api/v1/ai/generate") && request.method === "POST") {
    const parsed = await parseJsonBody(request);
    if (!parsed.ok) return envelopeError("invalid_body", parsed.error, 400);
    const v = validateBody(recSchema, parsed.value);
    if (!v.ok) return envelopeError("validation_error", v.error, 400);
    const result = await callAI(env, { task: v.value.task, prompt: v.value.prompt });
    await logAiJob(env, { task: v.value.task, model: result.model, promptVersion: AI_MODELS.promptVersion, status: result.mode, result: { mode: result.mode, provider: result.provider, length: result.text?.length || 0 } });
    const data = {
      ...result,
      evidenceRequired: "AI output is a draft only. It must be checked against the deterministic audit evidence and approved by the owner before any content change. AI never publishes automatically.",
    };
    return envelope(data, { source: result.mode === "live" ? "ai-provider" : "worker" });
  }
  return envelopeError("not_found", `Unknown AI endpoint: ${path}`, 404);
}
