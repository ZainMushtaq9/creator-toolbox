// Security tests (Phase 7) — SSRF fetch behaviour + secrets scan.
// Run: `npm test` (repo root). The auth/rate-limit checks live in the
// backend Worker tests (backend/tests/worker.test.mjs, 16 tests).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { fetchPage } from "../../backend/src/utils/fetchPage.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// --- fetchPage (SSRF) with a stubbed fetch ---
function stubFetch(handler) {
  return async (url, opts) => handler(url, opts);
}
function htmlResponse(html, { status = 200, contentType = "text/html; charset=utf-8" } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Map([["content-type", contentType]]),
    text: async () => html,
  };
}

test("fetchPage rejects a localhost URL without fetching", async () => {
  let called = false;
  const result = await fetchPage("http://localhost:8787/admin", { fetchImpl: stubFetch(() => { called = true; return htmlResponse("x"); }) });
  assert.equal(result.ok, false);
  assert.equal(called, false);
  assert.match(result.error, /not allowed/i);
});

test("fetchPage follows a redirect only after re-validating the target", async () => {
  const calls = [];
  const fetchImpl = stubFetch((url) => {
    calls.push(url);
    if (url === "https://example.com/a") {
      return { ok: false, status: 301, headers: new Map([["location", "https://example.com/b"], ["content-type", "text/html"]]), text: async () => "" };
    }
    return htmlResponse("<html><head><title>B</title></head><body><h1>B</h1></body></html>");
  });
  const result = await fetchPage("https://example.com/a", { fetchImpl });
  assert.equal(result.ok, true);
  assert.deepEqual(calls, ["https://example.com/a", "https://example.com/b"]);
});

test("fetchPage rejects a redirect to a private address", async () => {
  const fetchImpl = stubFetch((url) => {
    if (url === "https://example.com/a") {
      return { ok: false, status: 302, headers: new Map([["location", "http://169.254.169.254/"], ["content-type", "text/html"]]), text: async () => "" };
    }
    return htmlResponse("should never be fetched");
  });
  const result = await fetchPage("https://example.com/a", { fetchImpl });
  assert.equal(result.ok, false);
  assert.match(result.error, /private|blocked|metadata/i);
});

test("fetchPage rejects a redirect chain longer than 3 hops", async () => {
  const fetchImpl = stubFetch((url) => {
    const n = Number(url.slice(-1));
    if (n < 5) {
      return { ok: false, status: 302, headers: new Map([["location", `https://example.com/${n + 1}`], ["content-type", "text/html"]]), text: async () => "" };
    }
    return htmlResponse("done");
  });
  const result = await fetchPage("https://example.com/1", { fetchImpl });
  assert.equal(result.ok, false);
  assert.match(result.error, /redirect/i);
});

test("fetchPage rejects non-HTML content types", async () => {
  const result = await fetchPage("https://example.com/file.pdf", {
    fetchImpl: stubFetch(() => htmlResponse("%PDF-1.4", { contentType: "application/pdf" })),
  });
  assert.equal(result.ok, false);
  assert.match(result.error, /content-type|HTML/i);
});

test("fetchPage enforces the 2 MB size cap", async () => {
  const big = "x".repeat(2 * 1024 * 1024 + 1);
  const result = await fetchPage("https://example.com/big", {
    fetchImpl: stubFetch(() => htmlResponse(big)),
  });
  assert.equal(result.ok, false);
  assert.match(result.error, /too large|size/i);
});

// --- secrets scan ---
// Real secret material must never appear in the repo or in built bundles.
// Placeholders are allowed (they are documented in .env.example and the
// configs): sk-ar-v1-YOUR-KEY-HERE, pub-YOUR-PUBLISHER-ID, G-XXXXXXXXXX,
// REPLACE_WITH_REAL_D1_DATABASE_ID, empty values.
const SECRET_PATTERNS = [
  [/sk-ar-v1-(?!YOUR-KEY-HERE)[A-Za-z0-9]{8,}/, "AnyRouter key"],
  [/nvapi-[A-Za-z0-9_-]{10,}/, "NVIDIA API key"],
  [/gsk_[A-Za-z0-9]{10,}/, "Groq API key"],
  [/\bhf_[A-Za-z0-9]{10,}/, "Hugging Face token"],
  [/AIza[0-9A-Za-z_-]{10,}/, "Google API key"],
  [/pub-\d{10,}/, "AdSense publisher ID (real)"],
  [/G-(?!XXXXXXXXXX)[A-Z0-9]{8,}/, "GA4 measurement ID (real)"],
  [/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, "private key"],
  [/AKIA[0-9A-Z]{16}/, "AWS access key"],
  [/xox[baprs]-[0-9A-Za-z-]{10,}/, "Slack token"],
];

const SKIP_DIRS = new Set(["node_modules", ".git", ".wrangler"]);
const SKIP_FILES = new Set(["package-lock.json"]);

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else if (!SKIP_FILES.has(entry)) yield full;
  }
}

test("no real secret material in the repo or built bundles", () => {
  const hits = [];
  for (const file of walk(ROOT)) {
    if (/\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|map)$/.test(file)) continue;
    let text;
    try { text = readFileSync(file, "utf8"); } catch { continue; }
    for (const [re, label] of SECRET_PATTERNS) {
      if (re.test(text)) hits.push(`${label} in ${file.replace(ROOT, "")}`);
    }
  }
  assert.deepEqual(hits, [], `secrets found:\n${hits.join("\n")}`);
});

test("no ADMIN_TOKEN / OAuth secret value is committed", () => {
  const hits = [];
  for (const file of walk(ROOT)) {
    if (/\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|map)$/.test(file)) continue;
    let text;
    try { text = readFileSync(file, "utf8"); } catch { continue; }
    if (/(ADMIN_TOKEN|GOOGLE_CLIENT_SECRET|OAUTH_ENCRYPTION_KEY)\s*=\s*["'][^"']{8,}["']/.test(text)) {
      hits.push(file.replace(ROOT, ""));
    }
    // Secrets are set interactively (`wrangler secret put NAME` with no
    // value on the command line) — a value after the name would be a leak.
    if (/wrangler secret put [A-Z_]+ [A-Za-z0-9_\-]{8,}/.test(text)) {
      hits.push(`secret value on a command line in ${file.replace(ROOT, "")}`);
    }
  }
  assert.deepEqual(hits, []);
});
