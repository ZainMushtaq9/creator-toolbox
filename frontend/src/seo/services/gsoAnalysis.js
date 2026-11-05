// GSO — Generative Search Optimization diagnostic (Roadmap PDF §5.7 / §10).
// Internal framework only: it cannot guarantee citation or inclusion in
// AI-generated answers. Weights: answer completeness 20, factual support
// 15, originality 15, clarity 10, topic coverage 10, structure 10, entity
// clarity 5, crawlability 10, freshness/transparency 5 — total 100.
// Scores are computed from the supplied text/HTML with transparent
// heuristics; each factor reports its evidence.
import { parsePage } from "./pageAudit.js";

export const GSO_WEIGHTS = {
  completeness: 20, factualSupport: 15, originality: 15, clarity: 10,
  topicCoverage: 10, structure: 10, entityClarity: 5, crawlability: 10, freshness: 5,
};

export function gsoAnalysis({ url = "", html = "", text = "", questions = [] }) {
  const page = html ? parsePage(html, url) : null;
  const body = (text || page?.bodyText || "").trim();
  const words = body ? body.split(/\s+/) : [];
  const sentences = body ? body.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean) : [];
  const headings = page ? page.headings.flatMap((h) => h.items) : [];
  const factors = {};

  // Completeness (20): does the page answer the supplied questions?
  const qs = (questions || []).filter(Boolean).slice(0, 10);
  const answered = qs.filter((q) => {
    const key = q.toLowerCase().replace(/^(how|what|why|when|where|is|can|should|do|does)\s+/i, "").split(/\s+/).filter((w) => w.length > 3);
    return key.length > 0 && key.some((w) => body.toLowerCase().includes(w));
  });
  factors.completeness = {
    score: qs.length ? Math.round((answered.length / qs.length) * 20) : 10,
    evidence: qs.length ? `${answered.length} of ${qs.length} supplied question(s) appear answered in the text.` : "No questions supplied — score is neutral (10/20). Supply the questions the page should answer.",
  };

  // Factual support (15): numbers, dates, links, references.
  const numbers = (body.match(/\d+(\.\d+)?%?/g) || []).length;
  const links = page ? page.links.length : 0;
  factors.factualSupport = {
    score: Math.min(15, Math.round(numbers * 1.5) + Math.min(5, links)),
    evidence: `${numbers} number(s) and ${links} link(s) found in the text. Add sources for factual claims.`,
  };

  // Originality (15): unique-word ratio as a rough proxy, labelled as such.
  const unique = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean));
  const ratio = words.length ? unique.size / words.length : 0;
  factors.originality = {
    score: Math.round(Math.min(1, ratio * 1.4) * 15),
    evidence: `Unique-word ratio ${ratio.toFixed(2)} across ${words.length} words. This is a rough proxy for varied wording, not a plagiarism check.`,
  };

  // Clarity (10): average sentence length.
  const avgLen = sentences.length ? words.length / sentences.length : 0;
  factors.clarity = {
    score: avgLen === 0 ? 5 : avgLen <= 20 ? 10 : avgLen <= 28 ? 7 : 4,
    evidence: `Average sentence length ${avgLen.toFixed(1)} words across ${sentences.length} sentences. Shorter sentences are usually clearer.`,
  };

  // Topic coverage (10): heading count + word count.
  factors.topicCoverage = {
    score: Math.min(10, Math.round(headings.length * 1.5) + (words.length > 300 ? 3 : words.length > 100 ? 2 : 0)),
    evidence: `${headings.length} heading(s), ${words.length} words.`,
  };

  // Structure (10): H1 present + heading hierarchy.
  factors.structure = {
    score: page ? (page.h1s.length === 1 ? 10 : page.h1s.length === 0 ? 4 : 6) : 5,
    evidence: page ? `${page.h1s.length} H1 heading(s).` : "No HTML supplied — structure could not be checked from text alone.",
  };

  // Entity clarity (5): capitalised multi-word phrases as a rough proxy.
  const entities = new Set((body.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) || []));
  factors.entityClarity = {
    score: Math.min(5, entities.size),
    evidence: `${entities.size} capitalised multi-word phrase(s) found (rough entity proxy).`,
  };

  // Crawlability (10): from HTML when available.
  factors.crawlability = {
    score: page ? (page.robots && /noindex/i.test(page.robots) ? 0 : page.canonical ? 10 : 7) : 5,
    evidence: page ? (page.robots && /noindex/i.test(page.robots) ? "Page is noindex — not crawlable for search." : page.canonical ? "Canonical present." : "No canonical found.") : "No HTML supplied.",
  };

  // Freshness (5): a date in the text, or a <time> element.
  const hasDate = /\b(19|20)\d{2}\b/.test(body) || /<time/i.test(html || "");
  factors.freshness = {
    score: hasDate ? 5 : 2,
    evidence: hasDate ? "A year/date was found in the text." : "No date found — add a published/updated date so readers can judge freshness.",
  };

  const scores = {};
  for (const [k, v] of Object.entries(factors)) scores[k] = v.score;
  const score = Math.max(0, Math.min(100, Object.values(scores).reduce((a, b) => a + b, 0)));
  return {
    url, score, scores, weights: GSO_WEIGHTS,
    factors: Object.fromEntries(Object.entries(factors).map(([k, v]) => [k, { score: v.score, evidence: v.evidence }])),
    improvements: Object.entries(factors).filter(([k, v]) => v.score < GSO_WEIGHTS[k] * 0.6).map(([k, v]) => `${k}: ${v.evidence}`),
    note: "Internal GSO diagnostic only. No score can predict or guarantee inclusion in AI Overviews or any generative answer.",
  };
}
