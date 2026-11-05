// Admin routes — owner-only, require ADMIN_TOKEN (constant-time check).
// GET /api/v1/admin/usage — operational status (no private data).
// GET /api/v1/admin/health — health + configuration status.
// With no ADMIN_TOKEN configured, isAdmin() is always false, so both
// endpoints return 401 — the dashboard is locked by default.
import { envelope, envelopeError } from "../utils/envelope.js";
import { isAdmin } from "../security/authentication.js";
import { gscStatus } from "../services/searchConsole.js";
import { AI_MODELS } from "../config/aiModels.js";

export function adminHandler(request, env) {
  if (!isAdmin(request, env)) {
    return envelopeError("unauthorized", "Admin routes are protected. Send a valid Bearer ADMIN_TOKEN (Worker secret). With no token configured, admin is locked.", 401);
  }
  const url = new URL(request.url);
  const path = url.pathname;
  const status = {
    service: "creator-toolbox-api",
    version: "0.1.0",
    time: new Date().toISOString(),
    dbBound: Boolean(env?.DB),
    aiBound: Boolean(env?.AI),
    aiProvider: AI_MODELS.provider,
    aiConfigured: Boolean(env?.AI || env?.GEMINI_API_KEY || env?.HF_API_TOKEN || env?.ANYROUTER_API_KEY || env?.GROQ_API_KEY || env?.NVIDIA_API_KEY),
    aiMode: env?.AI || env?.GEMINI_API_KEY || env?.HF_API_TOKEN || env?.ANYROUTER_API_KEY || env?.GROQ_API_KEY || env?.NVIDIA_API_KEY ? "live-possible" : "mock-only",
    gsc: gscStatus(env),
    secretsConfigured: {
      GEMINI_API_KEY: Boolean(env?.GEMINI_API_KEY),
      HF_API_TOKEN: Boolean(env?.HF_API_TOKEN),
      ANYROUTER_API_KEY: Boolean(env?.ANYROUTER_API_KEY),
      GROQ_API_KEY: Boolean(env?.GROQ_API_KEY),
      NVIDIA_API_KEY: Boolean(env?.NVIDIA_API_KEY),
      GOOGLE_CLIENT_ID: Boolean(env?.GOOGLE_CLIENT_ID),
      OAUTH_ENCRYPTION_KEY: Boolean(env?.OAUTH_ENCRYPTION_KEY),
      ADMIN_TOKEN: Boolean(env?.ADMIN_TOKEN),
    },
  };
  if (path === "/api/v1/admin/usage" || path === "/api/v1/admin/health") {
    return envelope(status);
  }
  return envelopeError("not_found", `Unknown admin endpoint: ${path}`, 404);
}
