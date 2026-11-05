// Competitor page analysis (Roadmap PDF §5.4) — public page data ONLY.
// Fetches the competitor URL with the SSRF-safe fetcher, extracts the same
// public metadata as the audit, and compares it side-by-side with the
// owner's page. Never claims access to private competitor analytics,
// traffic, rankings or Search Console data.
import { fetchPage } from "../utils/fetchPage.js";
import { parsePage } from "./pageAudit.js";

export async function comparePages({ ownUrl, ownHtml, competitorUrl, fetchImpl = fetch }) {
  const own = parsePage(ownHtml || "", ownUrl);
  let competitor = null;
  let fetchError = null;
  if (competitorUrl) {
    const fetched = await fetchPage(competitorUrl, { fetchImpl });
    if (fetched.ok) competitor = parsePage(fetched.html, fetched.url);
    else fetchError = fetched.error;
  }
  const rows = [
    { field: "Title", own: own.title || "(none)", competitor: competitor?.title || "(none)" },
    { field: "Meta description", own: own.description || "(none)", competitor: competitor?.description || "(none)" },
    { field: "H1 count", own: String(own.h1s.length), competitor: competitor ? String(competitor.h1s.length) : "(none)" },
    { field: "Word count", own: String(own.wordCount), competitor: competitor ? String(competitor.wordCount) : "(none)" },
    { field: "Images", own: String(own.images.length), competitor: competitor ? String(competitor.images.length) : "(none)" },
    { field: "Images without alt", own: String(own.images.filter((i) => !i.alt).length), competitor: competitor ? String(competitor.images.filter((i) => !i.alt).length) : "(none)" },
    { field: "Links", own: String(own.links.length), competitor: competitor ? String(competitor.links.length) : "(none)" },
    { field: "Canonical", own: own.canonical || "(none)", competitor: competitor?.canonical || "(none)" },
    { field: "Structured data (JSON-LD blocks)", own: String(own.jsonLd.filter(Boolean).length), competitor: competitor ? String(competitor.jsonLd.filter(Boolean).length) : "(none)" },
  ];
  const gaps = [];
  if (competitor) {
    if (competitor.wordCount > own.wordCount * 1.5) gaps.push(`Competitor page has about ${competitor.wordCount} words vs your ${own.wordCount} — consider covering the topic more thoroughly.`);
    if (competitor.h1s.length === 1 && own.h1s.length !== 1) gaps.push("Competitor uses exactly one H1; your page does not.");
    if (competitor.description && !own.description) gaps.push("Competitor has a meta description and your page does not.");
    if (competitor.jsonLd.filter(Boolean).length > 0 && own.jsonLd.filter(Boolean).length === 0) gaps.push("Competitor uses structured data and your page does not.");
    if (gaps.length === 0) gaps.push("No clear public-metadata gap found in this comparison.");
  }
  return {
    ownUrl, competitorUrl: competitorUrl || null, fetchError,
    rows, gaps,
    note: "Comparison of public page metadata only. No competitor traffic, rankings or private analytics are available or claimed.",
  };
}
