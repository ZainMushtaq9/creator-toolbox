// Unit tests (Phase 7) — pure logic only. Run: `npm test` (repo root).
// Covers: text/format helpers, tool registry + SEO config, backend audit
// / keyword / GSO / AEO services, the JSON envelope, and URL validation.
// Tool components themselves are React UI — their behaviour is covered by
// the e2e smoke test (tests/e2e/smoke.test.mjs), not here.
import { test } from "node:test";
import assert from "node:assert/strict";

import { gcd, slugify } from "../../frontend/src/utils/format.js";
import { TOOLS, CATEGORIES, publicPages, getTool, relatedTools } from "../../frontend/src/config/tools.js";
import { pageMeta, webAppJsonLd } from "../../frontend/src/config/seo.js";
import { SITE_URL } from "../../frontend/src/config/site.js";
import { auditPage, AUDIT_WEIGHTS, parsePage } from "../../backend/src/services/pageAudit.js";
import { generateSuggestions, clusterKeywords, guessIntent } from "../../backend/src/services/keywordResearch.js";
import { gsoAnalysis, GSO_WEIGHTS } from "../../backend/src/services/gsoAnalysis.js";
import { aeoAnalysis } from "../../backend/src/services/aeoAnalysis.js";
import { envelope, envelopeError, validateBody } from "../../backend/src/utils/envelope.js";
import { validateFetchUrl } from "../../backend/src/security/urlValidation.js";

// --- format helpers ---
test("gcd computes greatest common divisors", () => {
  assert.equal(gcd(1280, 720), 80);
  assert.equal(gcd(1920, 1080), 120);
  assert.equal(gcd(7, 5), 1);
});

test("slugify normalises titles to slugs", () => {
  assert.equal(slugify("YouTube Title Generator!"), "youtube-title-generator");
  assert.equal(slugify("  Word Counter  "), "word-counter");
});

// --- tool registry / route metadata ---
test("registry has 21 tools in 5 categories", () => {
  assert.equal(TOOLS.length, 21);
  assert.equal(CATEGORIES.length, 5);
  for (const t of TOOLS) {
    assert.ok(t.slug && t.title && t.description, t.slug);
    assert.ok(t.description.length >= 40, t.slug);
    assert.ok((t.faqs || []).length >= 3, t.slug);
    assert.ok(CATEGORIES.some((c) => c.slug === t.category), t.slug);
    assert.ok((t.related || []).every((r) => getTool(r)), t.slug);
  }
});

test("tool slugs are unique and public pages are unique", () => {
  assert.equal(new Set(TOOLS.map((t) => t.slug)).size, 21);
  const paths = publicPages.map((p) => p.path);
  assert.equal(new Set(paths).size, paths.length);
  assert.equal(publicPages.length, 54);
});

test("pageMeta builds unique canonicals from SITE_URL + path", () => {
  const a = pageMeta({ title: "Word Counter", description: "Count words.", path: "/tools/word-counter" });
  assert.equal(a.canonical, `${SITE_URL}/tools/word-counter`);
  assert.equal(a.title, "Word Counter | CreatorToolbox");
  const b = pageMeta({ title: "Word Counter", description: "Count words.", path: "/tools/text-case-converter" });
  assert.notEqual(a.canonical, b.canonical);
});

test("webAppJsonLd is honest (free offer, no ratings/reviews)", () => {
  const tool = getTool("word-counter");
  const ld = webAppJsonLd(tool);
  assert.equal(ld["@type"], "WebApplication");
  assert.equal(ld.offers.price, "0");
  assert.equal(ld.offers.priceCurrency, "USD");
  assert.ok(!("aggregateRating" in ld));
});

// --- audit scoring ---
const GOOD_HTML = `<!doctype html><html><head><title>A Complete Guide to Video Editing Tools for Creators</title>
<meta name="description" content="Learn how video editing tools help creators cut, caption and publish faster, with a practical checklist.">
<link rel="canonical" href="https://example.com/guide"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="index, follow"></head><body><h1>Video Editing Tools</h1>
<p>Video editing is the core of creator workflows. This guide covers tools, formats and publishing.</p>
<h2>Choosing a tool</h2><p>Pick a tool that fits your format and budget.</p>
<img src="/a.png" alt="Video editing timeline"><a href="/tools">All tools</a>
<a href="https://example.com/other">Other page</a>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article"}</script>
</body></html>`;

test("audit weights sum to 100", () => {
  const total = Object.values(AUDIT_WEIGHTS).reduce((a, b) => a + b, 0);
  assert.equal(total, 100);
  const gsoTotal = Object.values(GSO_WEIGHTS).reduce((a, b) => a + b, 0);
  assert.equal(gsoTotal, 100);
});

test("audit scores a good page highly and flags nothing critical", () => {
  const result = auditPage({ url: "https://example.com/guide", html: GOOD_HTML, keyword: "video editing" });
  assert.ok(result.score >= 70, `score was ${result.score}`);
  assert.ok(result.score <= 100);
  assert.ok(!result.findings.some((f) => f.severity === "critical"), JSON.stringify(result.findings));
});

test("audit surfaces a critical noindex finding even when the score is high", () => {
  const html = GOOD_HTML.replace('content="index, follow"', 'content="noindex, follow"');
  const result = auditPage({ url: "https://example.com/guide", html, keyword: "video editing" });
  const critical = result.findings.find((f) => f.severity === "critical");
  assert.ok(critical, "noindex must be a critical finding");
  assert.match(critical.evidence, /noindex/i);
  for (const f of result.findings) {
    assert.ok(["metadata", "contentStructure", "keywordRelevance", "technical", "internalLinking", "images", "structuredData", "mobilePerformance"].includes(f.category));
    assert.ok(["critical", "high", "medium", "low", "info"].includes(f.severity));
    assert.ok(f.evidence && f.recommendation && f.benefit && f.status);
  }
});

test("audit flags missing alt text and missing title", () => {
  const html = `<!doctype html><html><head></head><body><h1>Hi</h1><img src="/a.png"><p>short</p></body></html>`;
  const result = auditPage({ url: "https://example.com/x", html });
  assert.ok(result.findings.some((f) => f.category === "images"), "missing alt must be flagged");
  assert.ok(result.findings.some((f) => f.category === "metadata"), "missing title must be flagged");
  assert.ok(result.score < 70);
});

test("parsePage extracts title, headings, images and JSON-LD", () => {
  const parsed = parsePage(GOOD_HTML, "https://example.com/guide");
  assert.equal(parsed.title, "A Complete Guide to Video Editing Tools for Creators");
  assert.equal(parsed.h1s.length, 1);
  assert.equal(parsed.images.length, 1);
  assert.equal(parsed.images[0].alt, "Video editing timeline");
  assert.equal(parsed.jsonLd.length, 1);
  assert.equal(parsed.jsonLd[0]["@type"], "Article");
});

// --- keyword research (never invents volume/difficulty) ---
test("keyword suggestions label volume and difficulty unavailable", () => {
  const result = generateSuggestions("video editing");
  assert.ok(result.suggestions.length > 0);
  for (const s of result.suggestions) {
    assert.equal(s.searchVolume, "unavailable");
    assert.equal(s.difficulty, "unavailable");
    assert.ok(typeof s.suggestion === "string" && s.suggestion.length > 0);
    assert.ok(/video|editing/i.test(s.suggestion), s.suggestion);
  }
  assert.equal(guessIntent("how to edit video"), "informational");
});

test("keyword clustering groups near-duplicates locally", () => {
  const clusters = clusterKeywords(["video editing", "video editing tips", "hashtag generator", "hashtag ideas"]);
  assert.equal(clusters.method, "local-jaccard");
  assert.ok(Array.isArray(clusters.clusters) && clusters.clusters.length >= 1);
});

// --- GSO / AEO ---
test("gso analysis scores 0-100 with all nine factors", () => {
  const result = gsoAnalysis({ url: "https://example.com/guide", text: "Video editing tools help creators. ".repeat(40), questions: ["What is video editing?"] });
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.equal(Object.keys(result.factors).length, 9);
});

test("aeo analysis runs 8 checks and scores 0-100", () => {
  const result = aeoAnalysis({ url: "https://example.com/guide", html: GOOD_HTML, text: "Video editing is the process of cutting footage. ".repeat(10) });
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.equal(result.checks.length, 8);
});

// --- envelope + validation ---
test("envelope shape is consistent for success and error", () => {
  const ok = envelope({ a: 1 }, { source: "worker" });
  assert.equal(ok.status, 200);
  const err = envelopeError("validation_error", "bad input", 400);
  assert.equal(err.status, 400);
});

test("envelopeError returns the structured error body", async () => {
  const res = envelopeError("not_found", "missing", 404);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.data, null);
  assert.equal(body.error.code, "not_found");
  assert.equal(body.error.message, "missing");
  assert.ok(body.meta.generatedAt);
});

test("envelope success body carries data + meta", async () => {
  const res = envelope({ score: 80 }, { source: "worker" });
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.score, 80);
  assert.equal(body.meta.source, "worker");
  assert.equal(body.error, null);
});

test("validateBody rejects input that fails the schema", () => {
  // Minimal schema-shaped object (validateBody only needs safeParse).
  const schema = {
    safeParse: (v) => (typeof v.prompt === "string" && v.prompt.length >= 1 && v.prompt.length <= 4000
      ? { success: true, data: v }
      : { success: false, error: { issues: [{ path: ["prompt"], message: "Required" }] } }),
  };
  assert.equal(validateBody(schema, { prompt: "" }).ok, false);
  assert.equal(validateBody(schema, { prompt: "Review the homepage" }).ok, true);
});

// --- URL validation ---
test("url validation rejects localhost, private, metadata and non-HTTP(S)", () => {
  for (const bad of [
    "http://localhost/admin",
    "http://127.0.0.1:8787/",
    "http://169.254.169.254/latest/meta-data/",
    "http://192.168.1.1/",
    "http://10.0.0.5/",
    "ftp://example.com/file",
    "javascript:alert(1)",
    "http://[::1]/",
  ]) {
    const r = validateFetchUrl(bad);
    assert.equal(r.ok, false, bad);
  }
});

test("url validation accepts public HTTPS URLs", () => {
  assert.equal(validateFetchUrl("https://example.com/page").ok, true);
  assert.equal(validateFetchUrl("http://example.com/page").ok, true);
});
