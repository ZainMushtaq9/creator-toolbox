// Google Search Console routes (Phase 5) — owner-only, require ADMIN_TOKEN.
// GET  /api/v1/gsc/connect?redirectUri=… — OAuth URL (state is HMAC-signed).
// GET  /api/v1/gsc/callback?code=…&state=… — exchange + encrypt + store token.
// GET  /api/v1/gsc/properties — list verified sites for the connected account.
// POST /api/v1/gsc/sync — pull Search Analytics into D1 (gsc_metrics).
// GET  /api/v1/gsc/performance — read stored metrics from D1.
// POST /api/v1/gsc/inspect — URL Inspection API.
// GET  /api/v1/gsc/status — connection status (never fakes a connection).
// Scope is read-only: https://www.googleapis.com/auth/webmasters.readonly
// With no Google credentials configured, every endpoint reports NOT
// CONNECTED with setup instructions — never invented Search Console data.
import { z } from "zod";
import { envelope, envelopeError, parseJsonBody, validateBody } from "../utils/envelope.js";
import { isAdmin } from "../security/authentication.js";
import { gscStatus, buildAuthUrl, exchangeCode, refreshAccessToken, fetchSearchAnalytics, listSites } from "../services/searchConsole.js";
import { encryptToken, decryptToken } from "../security/encryption.js";
import { newId } from "../utils/db.js";

const SYNC_SCHEMA = z.object({
  siteUrl: z.string().min(1).max(500),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
const INSPECT_SCHEMA = z.object({ siteUrl: z.string().min(1).max(500), url: z.string().url().max(2000) });

async function deriveKey(secret) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return new Uint8Array(digest);
}
function b64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64url(s) {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  return Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad), (c) => c.charCodeAt(0));
}
async function signState(env, nonce) {
  const keyMaterial = await deriveKey(env.OAUTH_ENCRYPTION_KEY);
  const key = await crypto.subtle.importKey("raw", keyMaterial, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const payload = JSON.stringify({ nonce, exp: Date.now() + 10 * 60 * 1000 });
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${b64url(new TextEncoder().encode(payload))}.${b64url(sig)}`;
}
async function verifyState(env, state) {
  const [payloadB64, sigB64] = String(state || "").split(".");
  if (!payloadB64 || !sigB64) return { ok: false, error: "Invalid OAuth state." };
  const keyMaterial = await deriveKey(env.OAUTH_ENCRYPTION_KEY);
  const key = await crypto.subtle.importKey("raw", keyMaterial, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const payloadBytes = unb64url(payloadB64);
  const valid = await crypto.subtle.verify("HMAC", key, unb64url(sigB64), payloadBytes);
  if (!valid) return { ok: false, error: "OAuth state verification failed." };
  let payload;
  try { payload = JSON.parse(new TextDecoder().decode(payloadBytes)); } catch { return { ok: false, error: "OAuth state is malformed." }; }
  if (Date.now() > payload.exp) return { ok: false, error: "OAuth state expired (10 minutes). Restart the flow." };
  return { ok: true, nonce: payload.nonce };
}

async function loadConnection(env) {
  if (!env?.DB) return null;
  return env.DB.prepare("SELECT * FROM gsc_connections ORDER BY created_at DESC LIMIT 1").first();
}

export async function googleHandler(request, env) {
  if (!isAdmin(request, env)) {
    return envelopeError("unauthorized", "Search Console endpoints are owner-only. Send a valid Bearer ADMIN_TOKEN (Worker secret).", 401);
  }
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/api/v1/gsc/status" && request.method === "GET") {
    const conn = await loadConnection(env);
    return envelope({ ...gscStatus(env), hasStoredConnection: Boolean(conn), propertyUrl: conn?.property_url || null });
  }

  if (path === "/api/v1/gsc/connect" && request.method === "GET") {
    const redirectUri = url.searchParams.get("redirectUri");
    if (!redirectUri) return envelopeError("validation_error", "Query parameter redirectUri is required (must match the Google Cloud Console redirect URI).", 400);
    if (!env?.GOOGLE_CLIENT_ID || !env?.OAUTH_ENCRYPTION_KEY) {
      return envelopeError("not_connected", "Google OAuth is NOT configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and OAUTH_ENCRYPTION_KEY as Worker secrets first. See docs/deployment.md.", 503);
    }
    const state = await signState(env, crypto.randomUUID());
    return envelope({ authUrl: buildAuthUrl(env, { redirectUri, state }), state, scope: "https://www.googleapis.com/auth/webmasters.readonly", note: "Redirect the owner to authUrl. Google returns to redirectUri with ?code=…&state=… ." });
  }

  if (path === "/api/v1/gsc/callback" && request.method === "GET") {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const redirectUri = url.searchParams.get("redirectUri");
    if (!code || !state || !redirectUri) return envelopeError("validation_error", "Query parameters code, state and redirectUri are required.", 400);
    const verified = await verifyState(env, state);
    if (!verified.ok) return envelopeError("invalid_state", verified.error, 400);
    if (!env?.DB) return envelopeError("no_db", "D1 is not bound — the token cannot be stored. Bind the creator_toolbox database first.", 503);
    try {
      const tokens = await exchangeCode(env, { code, redirectUri });
      const keyMaterial = await deriveKey(env.OAUTH_ENCRYPTION_KEY);
      const enc = await encryptToken(keyMaterial, tokens.refresh_token);
      const id = newId();
      await env.DB.prepare(
        "INSERT INTO gsc_connections (id, project_id, encrypted_refresh_token, token_iv, property_url, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(id, "default", JSON.stringify(enc.ciphertext), JSON.stringify(enc.iv), "", new Date().toISOString()).run();
      const sites = await listSites({ accessToken: tokens.access_token });
      return envelope({ connectionId: id, sites: sites.siteEntry || [], note: "Token stored encrypted. Pick your verified CreatorToolbox property and run POST /gsc/sync with its siteUrl." });
    } catch (e) {
      return envelopeError("oauth_failed", e?.message || "OAuth callback failed.", 502);
    }
  }

  if (path === "/api/v1/gsc/properties" && request.method === "GET") {
    const conn = await loadConnection(env);
    if (!conn) return envelopeError("not_connected", "No Search Console connection stored. Complete the OAuth flow first.", 503);
    try {
      const keyMaterial = await deriveKey(env.OAUTH_ENCRYPTION_KEY);
      const refreshToken = await decryptToken(keyMaterial, JSON.parse(conn.token_iv), JSON.parse(conn.encrypted_refresh_token));
      const tokens = await refreshAccessToken(env, refreshToken);
      const sites = await listSites({ accessToken: tokens.access_token });
      return envelope({ sites: sites.siteEntry || [] });
    } catch (e) {
      return envelopeError("gsc_failed", e?.message || "Could not list Search Console properties.", 502);
    }
  }

  if (path === "/api/v1/gsc/sync" && request.method === "POST") {
    const parsed = await parseJsonBody(request);
    if (!parsed.ok) return envelopeError("invalid_body", parsed.error, 400);
    const v = validateBody(SYNC_SCHEMA, parsed.value);
    if (!v.ok) return envelopeError("validation_error", v.error, 400);
    const conn = await loadConnection(env);
    if (!conn) return envelopeError("not_connected", "No Search Console connection stored. Complete the OAuth flow first.", 503);
    if (!env?.DB) return envelopeError("no_db", "D1 is not bound.", 503);
    try {
      const keyMaterial = await deriveKey(env.OAUTH_ENCRYPTION_KEY);
      const refreshToken = await decryptToken(keyMaterial, JSON.parse(conn.token_iv), JSON.parse(conn.encrypted_refresh_token));
      const tokens = await refreshAccessToken(env, refreshToken);
      const data = await fetchSearchAnalytics({ accessToken: tokens.access_token, siteUrl: v.value.siteUrl, startDate: v.value.startDate, endDate: v.value.endDate });
      let stored = 0;
      for (const row of data.rows || []) {
        const [page, query] = row.keys || [null, null];
        await env.DB.prepare(
          "INSERT OR REPLACE INTO gsc_metrics (id, project_id, date, page, query, country, device, clicks, impressions, ctr, position, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(newId(), "default", v.value.startDate, page, query, "", "", row.clicks || 0, row.impressions || 0, row.ctr || 0, row.position || null, new Date().toISOString()).run();
        stored++;
      }
      await env.DB.prepare("INSERT INTO gsc_sync_logs (id, connection_id, status, message, created_at) VALUES (?, ?, ?, ?, ?)")
        .bind(newId(), conn.id, "ok", `Synced ${stored} rows for ${v.value.siteUrl} (${v.value.startDate}–${v.value.endDate}).`, new Date().toISOString()).run();
      if (conn.property_url !== v.value.siteUrl) {
        await env.DB.prepare("UPDATE gsc_connections SET property_url = ? WHERE id = ?").bind(v.value.siteUrl, conn.id).run();
      }
      return envelope({ siteUrl: v.value.siteUrl, rowsStored: stored, note: "Metrics are first-party Search Console data for your own property only." });
    } catch (e) {
      return envelopeError("gsc_failed", e?.message || "Search Console sync failed.", 502);
    }
  }

  if (path === "/api/v1/gsc/performance" && request.method === "GET") {
    if (!env?.DB) return envelopeError("no_db", "D1 is not bound — no stored metrics exist.", 503);
    const siteUrl = url.searchParams.get("siteUrl") || "";
    const startDate = url.searchParams.get("startDate") || "";
    const endDate = url.searchParams.get("endDate") || "";
    const res = await env.DB.prepare(
      "SELECT date, page, query, clicks, impressions, ctr, position FROM gsc_metrics WHERE (? = '' OR page = ?) AND (? = '' OR date >= ?) AND (? = '' OR date <= ?) ORDER BY date DESC, impressions DESC LIMIT 100"
    ).bind(siteUrl, siteUrl, startDate, startDate, endDate, endDate).all();
    return envelope({ rows: res.results || [], note: "Stored first-party Search Console metrics only. No data exists until a sync has run." });
  }

  if (path === "/api/v1/gsc/inspect" && request.method === "POST") {
    const parsed = await parseJsonBody(request);
    if (!parsed.ok) return envelopeError("invalid_body", parsed.error, 400);
    const v = validateBody(INSPECT_SCHEMA, parsed.value);
    if (!v.ok) return envelopeError("validation_error", v.error, 400);
    const conn = await loadConnection(env);
    if (!conn) return envelopeError("not_connected", "No Search Console connection stored. Complete the OAuth flow first.", 503);
    try {
      const keyMaterial = await deriveKey(env.OAUTH_ENCRYPTION_KEY);
      const refreshToken = await decryptToken(keyMaterial, JSON.parse(conn.token_iv), JSON.parse(conn.encrypted_refresh_token));
      const tokens = await refreshAccessToken(env, refreshToken);
      const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokens.access_token}` },
        body: JSON.stringify({ inspectionUrl: v.value.url, siteUrl: v.value.siteUrl }),
      });
      if (!res.ok) throw new Error(`URL Inspection API failed (HTTP ${res.status}).`);
      return envelope(await res.json(), { source: "gsc" });
    } catch (e) {
      return envelopeError("gsc_failed", e?.message || "URL Inspection failed.", 502);
    }
  }

  return envelopeError("not_found", `Unknown Google endpoint: ${path}`, 404);
}
