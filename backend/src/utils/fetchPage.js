// SSRF-safe page fetching (Roadmap PDF §4.7 / Brief §4).
// Uses security/urlValidation.js, follows redirects manually and re-validates
// EVERY redirect destination. Caps response size, content type and time.
// Never executes remote JavaScript — the body is treated as text only.
// Known limitation: Workers cannot do a DNS lookup before fetching, so a
// hostname that resolves to a private IP after validation (DNS rebinding)
// cannot be fully excluded here. Mitigation: only http/https, size/time
// caps, no credentials, and the fetched content is never executed or
// trusted as code. Documented in docs/SECURITY_REPORT.md.
import { validateFetchUrl } from "../security/urlValidation.js";

const MAX_BYTES = 2 * 1024 * 1024;
const TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 3;

export async function fetchPage(rawUrl, { fetchImpl = fetch, maxBytes = MAX_BYTES } = {}) {
  let current = rawUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const check = validateFetchUrl(current);
    if (!check.ok) return { ok: false, error: check.error };
    let res;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        res = await fetchImpl(check.url, {
          redirect: "manual",
          signal: controller.signal,
          headers: { "User-Agent": "CreatorToolboxBot/1.0 (+https://YOUR-DOMAIN)", Accept: "text/html,application/xhtml+xml" },
        });
      } finally {
        clearTimeout(timer);
      }
    } catch (e) {
      return { ok: false, error: e?.name === "AbortError" ? "Fetch timed out (8s)." : `Fetch failed: ${e?.message || "network error"}` };
    }
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return { ok: false, error: "Redirect without a location." };
      if (hop === MAX_REDIRECTS) return { ok: false, error: "Too many redirects (max 3)." };
      try {
        current = new URL(location, check.url).toString();
      } catch {
        return { ok: false, error: "Redirect location is not a valid URL." };
      }
      continue;
    }
    if (res.status !== 200) return { ok: false, error: `Page returned HTTP ${res.status}.` };
    const type = (res.headers.get("content-type") || "").toLowerCase();
    if (type && !type.includes("text/html") && !type.includes("application/xhtml")) {
      return { ok: false, error: `Unsupported content type: ${type.split(";")[0] || "unknown"}. Only HTML pages are fetched.` };
    }
    const text = await res.text();
    if (text.length > maxBytes) return { ok: false, error: `Page too large (over ${Math.round(maxBytes / 1024 / 1024)} MB).` };
    return { ok: true, url: check.url, status: res.status, html: text, bytes: text.length };
  }
  return { ok: false, error: "Too many redirects (max 3)." };
}
