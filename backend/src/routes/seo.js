// SEO Intelligence routes (Phase 5) — owner-only, require ADMIN_TOKEN.
// Endpoints (Brief §4): POST /keyword/research, POST /keyword/cluster,
// POST /audit/page, POST /audit/compare, POST /competitor/analyze,
// POST /content/gaps, POST /gso/analyze, POST /aeo/analyze (extra).
// All responses use the JSON envelope. No search volume, difficulty,
// rankings or competitor traffic are ever invented.
import { z } from "zod";
import { envelope, envelopeError, parseJsonBody, validateBody } from "../utils/envelope.js";
import { isAdmin } from "../security/authentication.js";
import { generateSuggestions, clusterKeywords } from "../services/keywordResearch.js";
import { auditPage } from "../services/pageAudit.js";
import { comparePages } from "../services/competitorAnalysis.js";
import { contentGaps } from "../services/contentGap.js";
import { gsoAnalysis } from "../services/gsoAnalysis.js";
import { aeoAnalysis } from "../services/aeoAnalysis.js";
import { fetchPage } from "../utils/fetchPage.js";
import { saveAudit, saveKeywords } from "../utils/db.js";

const keywordSchema = z.object({
  keyword: z.string().min(1).max(100),
  country: z.string().length(2).optional().default("US"),
  language: z.string().min(2).max(5).optional().default("en"),
  searchIntent: z.string().max(30).optional(),
});
const clusterSchema = z.object({ keywords: z.array(z.string().min(1).max(100)).min(1).max(200) });
const auditSchema = z.object({
  url: z.string().url().max(2000),
  html: z.string().max(2 * 1024 * 1024).optional(),
  keyword: z.string().max(100).optional().default(""),
});
const compareSchema = z.object({
  ownUrl: z.string().url().max(2000),
  ownHtml: z.string().max(2 * 1024 * 1024),
  competitorUrl: z.string().url().max(2000).optional(),
});
const gapsSchema = z.object({
  ownHtml: z.string().max(2 * 1024 * 1024),
  ownUrl: z.string().max(2000).optional().default(""),
  competitorHtml: z.string().max(2 * 1024 * 1024),
  competitorUrl: z.string().max(2000).optional().default(""),
  keywords: z.array(z.string().max(100)).max(100).optional().default([]),
});
const gsoSchema = z.object({
  url: z.string().max(2000).optional().default(""),
  html: z.string().max(2 * 1024 * 1024).optional().default(""),
  text: z.string().max(100000).optional().default(""),
  questions: z.array(z.string().max(200)).max(10).optional().default([]),
});

export async function seoHandler(request, env) {
  if (!isAdmin(request, env)) {
    return envelopeError("unauthorized", "SEO Intelligence is owner-only. Send a valid Bearer ADMIN_TOKEN (Worker secret). With no token configured, this endpoint is locked.", 401);
  }
  const url = new URL(request.url);
  const path = url.pathname;
  if (request.method !== "POST") return envelopeError("method_not_allowed", "This endpoint requires POST.", 405);
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return envelopeError("invalid_body", parsed.error, 400);

  if (path === "/api/v1/keyword/research") {
    const v = validateBody(keywordSchema, parsed.value);
    if (!v.ok) return envelopeError("validation_error", v.error, 400);
    const result = generateSuggestions(v.value.keyword, v.value);
    await saveKeywords(env, { keyword: result.keyword, country: result.country, language: result.language, intent: result.searchIntent, suggestions: result.suggestions.map((s) => s.suggestion) });
    return envelope(result, { source: "worker" });
  }
  if (path === "/api/v1/keyword/cluster") {
    const v = validateBody(clusterSchema, parsed.value);
    if (!v.ok) return envelopeError("validation_error", v.error, 400);
    return envelope(clusterKeywords(v.value.keywords), { source: "worker" });
  }
  if (path === "/api/v1/audit/page") {
    const v = validateBody(auditSchema, parsed.value);
    if (!v.ok) return envelopeError("validation_error", v.error, 400);
    let html = v.value.html;
    if (!html) {
      const fetched = await fetchPage(v.value.url);
      if (!fetched.ok) return envelopeError("fetch_failed", fetched.error, 422);
      html = fetched.html;
    }
    const result = auditPage({ url: v.value.url, html, keyword: v.value.keyword });
    await saveAudit(env, { url: v.value.url, score: result.score, auditData: result });
    return envelope(result, { source: "worker" });
  }
  if (path === "/api/v1/audit/compare" || path === "/api/v1/competitor/analyze") {
    const v = validateBody(compareSchema, parsed.value);
    if (!v.ok) return envelopeError("validation_error", v.error, 400);
    const result = await comparePages(v.value);
    return envelope(result, { source: "worker" });
  }
  if (path === "/api/v1/content/gaps") {
    const v = validateBody(gapsSchema, parsed.value);
    if (!v.ok) return envelopeError("validation_error", v.error, 400);
    return envelope(contentGaps(v.value), { source: "worker" });
  }
  if (path === "/api/v1/gso/analyze") {
    const v = validateBody(gsoSchema, parsed.value);
    if (!v.ok) return envelopeError("validation_error", v.error, 400);
    return envelope(gsoAnalysis(v.value), { source: "worker" });
  }
  if (path === "/api/v1/aeo/analyze") {
    const v = validateBody(gsoSchema, parsed.value);
    if (!v.ok) return envelopeError("validation_error", v.error, 400);
    return envelope(aeoAnalysis(v.value), { source: "worker" });
  }
  return envelopeError("not_found", `Unknown SEO endpoint: ${path}`, 404);
}
