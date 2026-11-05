// Deterministic on-page SEO audit (Roadmap PDF §5.5).
// Parses HTML with regex (no heavy DOM dependency in the Worker).
// Weights: metadata 15, content structure 15, keyword relevance 15,
// technical SEO 20, internal linking 10, images 10, structured data 5,
// mobile/performance 10 — total 100. This is CreatorToolbox's diagnostic
// score, NOT a Google ranking formula.
// Every finding: { category, severity, evidence, recommendation, benefit, status }.
// A critical noindex is always surfaced, even if the aggregate score is high.
export const AUDIT_WEIGHTS = {
  metadata: 15, contentStructure: 15, keywordRelevance: 15, technical: 20,
  internalLinking: 10, images: 10, structuredData: 5, mobilePerformance: 10,
};

export function parsePage(html, url = "") {
  const text = String(html || "");
  const title = matchTag(text, "title");
  const description = matchMeta(text, "description");
  const canonical = matchLinkRel(text, "canonical");
  const robots = matchMeta(text, "robots");
  const viewport = matchMeta(text, "viewport");
  const h1s = matchAllTags(text, "h1");
  const headings = ["h1", "h2", "h3", "h4"].map((t) => ({ tag: t, items: matchAllTags(text, t) }));
  const images = [...text.matchAll(/<img\b[^>]*>/gi)].map((m) => ({
    alt: /alt\s*=\s*["']([^"']*)["']/i.exec(m[0])?.[1] ?? null,
    src: /src\s*=\s*["']([^"']*)["']/i.exec(m[0])?.[1] ?? "",
  }));
  const links = [...text.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi)].map((m) => m[1]);
  const jsonLd = [...text.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => { try { return JSON.parse(m[1]); } catch { return null; } });
  const bodyText = text.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return { url, title, description, canonical, robots, viewport, h1s, headings, images, links, jsonLd, bodyText, wordCount: bodyText ? bodyText.split(" ").length : 0 };
}

function matchTag(html, tag) {
  const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i").exec(html);
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
}
function matchMeta(html, name) {
  const m = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, "i").exec(html)
    || new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, "i").exec(html);
  return m ? m[1].trim() : "";
}
function matchLinkRel(html, rel) {
  const m = new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']*)["']`, "i").exec(html)
    || new RegExp(`<link[^>]*href=["']([^"']*)["'][^>]*rel=["']${rel}["']`, "i").exec(html);
  return m ? m[1].trim() : "";
}
function matchAllTags(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))].map((m) => m[1].replace(/<[^>]+>/g, "").trim()).filter(Boolean);
}

export function auditPage({ url, html, keyword = "" }) {
  const page = parsePage(html, url);
  const kw = keyword.trim().toLowerCase();
  const findings = [];
  const add = (category, severity, evidence, recommendation, benefit) =>
    findings.push({ category, severity, evidence, recommendation, benefit, status: "open" });

  // Metadata (15)
  let metadata = 15;
  if (!page.title) { metadata -= 8; add("metadata", "critical", "No <title> found.", "Add a unique, descriptive title (under ~60 characters).", "Search results show the title first; without one the page is hard to find."); }
  else if (page.title.length > 60) { metadata -= 4; add("metadata", "medium", `Title is ${page.title.length} characters.`, "Shorten the title to under 60 characters so it is not cut off in search results.", "More of the title is visible in search results."); }
  if (!page.description) { metadata -= 7; add("metadata", "high", "No meta description found.", "Add a unique meta description (120–160 characters) summarising the page.", "A good description can improve click-through from search results."); }
  else if (page.description.length > 160) { metadata -= 3; add("metadata", "low", `Meta description is ${page.description.length} characters.`, "Shorten it to under 160 characters.", "The full description is more likely to display."); }

  // Content structure (15)
  let contentStructure = 15;
  if (page.h1s.length === 0) { contentStructure -= 8; add("contentStructure", "critical", "No H1 heading found.", "Add exactly one clear H1 that states what the page is about.", "The H1 tells readers and search engines the page's main topic."); }
  else if (page.h1s.length > 1) { contentStructure -= 5; add("contentStructure", "medium", `${page.h1s.length} H1 headings found: ${page.h1s.slice(0, 3).join(" | ")}.`, "Keep one H1 per page and use H2/H3 for sub-sections.", "A single H1 makes the page structure clearer."); }
  if (page.wordCount < 100) { contentStructure -= 4; add("contentStructure", "medium", `Only about ${page.wordCount} words of visible text.`, "Add useful, original explanation, examples or instructions.", "Thin pages rarely answer the visitor's question fully."); }

  // Keyword relevance (15)
  let keywordRelevance = 15;
  if (kw) {
    const inTitle = page.title.toLowerCase().includes(kw);
    const inH1 = page.h1s.some((h) => h.toLowerCase().includes(kw));
    const first100 = page.bodyText.split(" ").slice(0, 100).join(" ").toLowerCase().includes(kw);
    const count = page.bodyText.toLowerCase().split(kw).length - 1;
    if (!inTitle) { keywordRelevance -= 6; add("keywordRelevance", "high", `Keyword "${kw}" is not in the title.`, "Include the main keyword naturally in the title.", "The title is the strongest on-page keyword signal."); }
    if (!inH1) { keywordRelevance -= 4; add("keywordRelevance", "medium", `Keyword "${kw}" is not in the H1.`, "Use the keyword in the H1 where it reads naturally.", "Headings reinforce what the page is about."); }
    if (!first100) { keywordRelevance -= 3; add("keywordRelevance", "low", `Keyword "${kw}" does not appear in the first 100 words.`, "Mention the topic early in the introduction.", "Readers and search engines see the topic sooner."); }
    if (count === 0) { keywordRelevance -= 2; add("keywordRelevance", "high", `Keyword "${kw}" does not appear in the page text at all.`, "Cover the topic in the body text — do not just repeat the keyword.", "A page cannot rank for a topic it never discusses."); }
  } else {
    add("keywordRelevance", "info", "No target keyword was supplied for this audit.", "Re-run the audit with a target keyword to check placement.", "Keyword placement cannot be checked without a target keyword.");
  }

  // Technical SEO (20)
  let technical = 20;
  const noindex = /noindex/i.test(page.robots || "");
  if (noindex) { technical -= 10; add("technical", "critical", "Robots meta contains noindex — this page tells search engines not to index it.", "Remove noindex if the page should appear in search, or keep it deliberately and exclude the page from the sitemap.", "A noindexed page cannot appear in search results at all."); }
  if (!page.canonical) { technical -= 4; add("technical", "medium", "No canonical URL found.", "Add a self-referencing canonical URL.", "Canonicals prevent duplicate-content confusion."); }
  if (!page.viewport) { technical -= 3; add("technical", "medium", "No viewport meta tag found.", "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.", "Without it the page may render badly on phones."); }
  if (!/^https?:\/\//.test(url || "")) { technical -= 3; add("technical", "low", "URL is not an absolute HTTP/HTTPS URL.", "Audit with the page's full public URL.", "The audit cannot verify the live URL otherwise."); }

  // Internal linking (10)
  let internalLinking = 10;
  let internal = [];
  try { internal = page.links.filter((l) => l.startsWith("/") || (url && l.startsWith(new URL(url).origin))); } catch { internal = page.links.filter((l) => l.startsWith("/")); }
  const broken = page.links.filter((l) => l === "#" || l.trim() === "");
  if (internal.length === 0) { internalLinking -= 6; add("internalLinking", "medium", "No internal links found.", "Link to related tools, categories or articles on the same site.", "Internal links help visitors and crawlers discover related pages."); }
  if (broken.length > 0) { internalLinking -= 4; add("internalLinking", "medium", `${broken.length} empty "#" link(s) found.`, "Replace empty links with real destinations or remove them.", "Dead links confuse visitors and waste crawl attention."); }

  // Images (10)
  let images = 10;
  const withoutAlt = page.images.filter((i) => i.alt === null || i.alt === "");
  if (page.images.length > 0 && withoutAlt.length > 0) { images -= Math.min(10, withoutAlt.length * 2); add("images", "medium", `${withoutAlt.length} of ${page.images.length} image(s) have no useful alt text.`, "Add short descriptive alt text to every meaningful image.", "Alt text helps accessibility and image search."); }

  // Structured data (5)
  let structuredData = 5;
  if (page.jsonLd.filter(Boolean).length === 0) { structuredData -= 3; add("structuredData", "low", "No valid JSON-LD structured data found.", "Add JSON-LD only where it accurately describes visible page content.", "Structured data can help search engines understand the page."); }

  // Mobile / performance (10) — viewport only is measurable here; real
  // Core Web Vitals need production measurement (Phase 6/7).
  let mobilePerformance = 10;
  if (!page.viewport) { mobilePerformance -= 5; add("mobilePerformance", "medium", "No viewport tag — mobile rendering cannot be confirmed.", "Add the viewport meta tag and test on a phone-sized screen.", "Most visitors arrive on mobile."); }
  add("mobilePerformance", "info", "Core Web Vitals (LCP/INP/CLS) were not measured by this audit — they need production measurement.", "Measure them in Search Console / PageSpeed Insights after deployment.", "Lab estimates do not replace real-user data.");

  const scores = { metadata, contentStructure, keywordRelevance, technical, internalLinking, images, structuredData, mobilePerformance };
  const score = Math.max(0, Math.min(100, Object.values(scores).reduce((a, b) => a + b, 0)));
  return {
    url, score, scores, weights: AUDIT_WEIGHTS, findings,
    summary: { title: page.title, description: page.description, h1Count: page.h1s.length, wordCount: page.wordCount, imageCount: page.images.length, linkCount: page.links.length, noindex },
    note: "CreatorToolbox diagnostic score (0–100), not a Google ranking formula. Critical findings stay visible even when the aggregate score is high.",
  };
}
