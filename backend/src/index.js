import { healthHandler } from "./routes/health.js";
import { toolsConfigHandler } from "./routes/tools.js";
import { seoHandler } from "./routes/seo.js";
import { aiHandler } from "./routes/ai.js";
import { googleHandler } from "./routes/google.js";
import { reportsHandler } from "./routes/reports.js";
import { adminHandler } from "./routes/admin.js";
import { rateLimit, rateLimitKey } from "./security/rateLimit.js";
import { envelopeError } from "./utils/envelope.js";

// Cloudflare Worker — API gateway (Phase 4, M2).
// Public: GET /api/v1/health, GET /api/v1/tools/config.
// Owner-only (Bearer ADMIN_TOKEN, locked by default when no token is set):
// /api/v1/seo/*, /api/v1/ai/*, /api/v1/google/* (gsc), /api/v1/reports/*,
// /api/v1/admin/*. All responses use the JSON envelope.
// CORS: only the configured ALLOWED_ORIGIN is reflected (env var, set to
// the real site origin at deploy time). Any other Origin gets no
// Access-Control-Allow-Origin header — the old code reflected every Origin,
// which is fixed here. No secrets in code, ever.
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (rateLimit(request)) {
      return withCors(envelopeError("rate_limited", "Too many requests. Try again later.", 429), cors);
    }
    // Stricter cap for AI endpoints: 10 requests/min per IP.
    if (pathname.startsWith("/api/v1/ai/") && rateLimitKey(request, "ai", 10)) {
      return withCors(envelopeError("rate_limited", "AI rate limit reached (10/min). Try again later.", 429), cors);
    }
    let res;
    try {
      if (pathname === "/api/v1/health") res = healthHandler(env);
      else if (pathname === "/api/v1/tools/config") res = toolsConfigHandler();
      else if (pathname.startsWith("/api/v1/keyword/") || pathname.startsWith("/api/v1/audit/") || pathname.startsWith("/api/v1/competitor/") || pathname.startsWith("/api/v1/content/") || pathname.startsWith("/api/v1/gso/") || pathname.startsWith("/api/v1/aeo/")) res = await seoHandler(request, env);
      else if (pathname.startsWith("/api/v1/ai/")) res = await aiHandler(request, env);
      else if (pathname.startsWith("/api/v1/gsc/")) res = await googleHandler(request, env);
      else if (pathname.startsWith("/api/v1/reports")) res = await reportsHandler(request, env);
      else if (pathname.startsWith("/api/v1/admin/")) res = adminHandler(request, env);
      else res = envelopeError("not_found", `Unknown endpoint: ${pathname}`, 404);
    } catch (e) {
      // Never leak a stack trace or internal detail to the client.
      console.error("Worker error:", e);
      res = envelopeError("internal_error", "Something went wrong on the server.", 500);
    }
    return withCors(res, cors);
  }
};

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = env?.ALLOWED_ORIGIN || "";
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
  if (allowed && origin === allowed) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function withCors(res, cors) {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(cors)) headers.set(k, v);
  return new Response(res.body, { status: res.status, headers });
}

// Kept for backwards compatibility with older route imports.
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
