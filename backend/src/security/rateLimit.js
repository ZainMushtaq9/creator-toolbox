// Minimal in-memory rate-limit (per-Worker-instance).
// Production use should move to Cloudflare Rate Limiting / Durable Objects.
const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_HITS = 60;
export function rateLimit(request) {
  return rateLimitKey(request, "global", MAX_HITS, WINDOW_MS);
}
// Per-key rate limiting (e.g. stricter caps for AI endpoints).
export function rateLimitKey(request, key, maxHits, windowMs = WINDOW_MS) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const mapKey = `${key}:${ip}`;
  const now = Date.now();
  const entry = hits.get(mapKey) || { count: 0, reset: now + windowMs };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs; }
  entry.count += 1;
  hits.set(mapKey, entry);
  return entry.count > maxHits;
}
