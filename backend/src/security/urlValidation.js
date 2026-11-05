// SSRF-safe URL validation for competitor page fetching (Phase 5).
// Rules: HTTP/HTTPS only; reject localhost, private/reserved IPs,
// internal hostnames and cloud metadata addresses; recheck every redirect.
const BLOCKED_HOSTS = new Set(["localhost", "metadata.google.internal"]);
const PRIVATE_IP = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|169\.254\.|0\.0\.0\.0|::1|fe80:|fc00:|fd00:)/i;

export function validateFetchUrl(raw, { maxRedirects = 3 } = {}) {
  let url;
  try { url = new URL(raw); } catch { return { ok: false, error: "Invalid URL." }; }
  if (url.protocol !== "http:" && url.protocol !== "https:") return { ok: false, error: "Only HTTP and HTTPS URLs are allowed." };
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (BLOCKED_HOSTS.has(host) || host.endsWith(".local") || host.endsWith(".internal")) {
    return { ok: false, error: "Internal hostnames are not allowed." };
  }
  if (PRIVATE_IP.test(host)) return { ok: false, error: "Private IP addresses are not allowed." };
  if (url.username || url.password) return { ok: false, error: "URLs with credentials are not allowed." };
  return { ok: true, url: url.toString(), maxRedirects, maxBytes: 2 * 1024 * 1024, timeoutMs: 8000 };
}

export function validateRedirect(location, depth) {
  if (depth <= 0) return { ok: false, error: "Too many redirects." };
  return validateFetchUrl(location, { maxRedirects: depth - 1 });
}
