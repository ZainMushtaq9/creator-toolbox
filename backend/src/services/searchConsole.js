// Google Search Console integration (Roadmap PDF §5.6 / Brief §5).
// OAuth 2.0, read-only scope: https://www.googleapis.com/auth/webmasters.readonly
// Owner's verified CreatorToolbox property ONLY. Refresh tokens are stored
// encrypted (AES-GCM, key from OAUTH_ENCRYPTION_KEY Worker secret) in D1.
// HARD RULE: with no Google credentials configured, every function returns
// { connected: false, ... } with setup instructions — NEVER a fake
// connection, fake clicks/impressions, or invented Search Console data.
export const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_BASE = "https://searchconsole.googleapis.com/v1";

export function gscStatus(env) {
  const configured = Boolean(env?.GOOGLE_CLIENT_ID && env?.GOOGLE_CLIENT_SECRET && env?.OAUTH_ENCRYPTION_KEY);
  return {
    connected: false,
    configured,
    scope: GSC_SCOPE,
    ...(configured
      ? { note: "Credentials are configured, but no Search Console connection has been completed yet. Complete the OAuth flow to connect." }
      : { note: "NOT CONNECTED — Google OAuth credentials are not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and OAUTH_ENCRYPTION_KEY as Worker secrets, then complete the OAuth flow. No Search Console data exists until then." }),
  };
}

export function buildAuthUrl(env, { redirectUri, state }) {
  if (!env?.GOOGLE_CLIENT_ID || !redirectUri) {
    throw new Error("Google OAuth is not configured (GOOGLE_CLIENT_ID / redirect URI missing).");
  }
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GSC_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export async function exchangeCode(env, { code, redirectUri, fetchImpl = fetch }) {
  if (!env?.GOOGLE_CLIENT_ID || !env?.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth is not configured.");
  }
  const res = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri, grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`Google token exchange failed (HTTP ${res.status}).`);
  const data = await res.json();
  if (!data.refresh_token) throw new Error("Google did not return a refresh token. Re-run the flow with prompt=consent.");
  return data; // { access_token, refresh_token, expires_in, ... } — caller encrypts + stores refresh_token
}

export async function refreshAccessToken(env, refreshToken, { fetchImpl = fetch } = {}) {
  const res = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Google token refresh failed (HTTP ${res.status}).`);
  return res.json();
}

export async function fetchSearchAnalytics({ accessToken, siteUrl, startDate, endDate, dimensions = ["page", "query"], rowLimit = 100, fetchImpl = fetch }) {
  const res = await fetchImpl(`${API_BASE}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ startDate, endDate, dimensions, rowLimit }),
  });
  if (!res.ok) throw new Error(`Search Console API failed (HTTP ${res.status}).`);
  return res.json();
}

export async function listSites({ accessToken, fetchImpl = fetch }) {
  const res = await fetchImpl(`${API_BASE}/sites`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Search Console API failed (HTTP ${res.status}).`);
  return res.json();
}
