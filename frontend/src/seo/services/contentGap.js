// Keyword / content gap analysis (Roadmap PDF §5.5 + Brief §5).
// Compares the topics/keywords a competitor page covers (from its public
// headings + text) with the topics the owner's page covers, and lists
// topics present on the competitor page but missing on the owner's page.
// Everything here comes from text the caller supplied or fetched publicly;
// no search volume, rankings or competitor traffic are involved.
import { parsePage } from "./pageAudit.js";

function topicsFrom(page) {
  const words = new Set();
  for (const h of [...page.h1s, ...page.headings.flatMap((x) => x.items)]) {
    h.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3).forEach((w) => words.add(w));
  }
  return words;
}

export function contentGaps({ ownHtml, ownUrl = "", competitorHtml, competitorUrl = "", keywords = [] }) {
  const own = parsePage(ownHtml || "", ownUrl);
  const comp = parsePage(competitorHtml || "", competitorUrl);
  const ownTopics = topicsFrom(own);
  const compTopics = topicsFrom(comp);
  const missingTopics = [...compTopics].filter((t) => !ownTopics.has(t)).sort();
  const coveredTopics = [...compTopics].filter((t) => ownTopics.has(t)).sort();
  const kw = (keywords || []).map((k) => String(k).toLowerCase().trim()).filter(Boolean);
  const ownText = own.bodyText.toLowerCase();
  const compText = comp.bodyText.toLowerCase();
  const keywordGaps = kw
    .filter((k) => compText.includes(k) && !ownText.includes(k))
    .map((k) => ({ keyword: k, status: "on competitor page, missing on your page" }));
  const keywordCovered = kw
    .filter((k) => ownText.includes(k))
    .map((k) => ({ keyword: k, status: "covered on your page" }));
  return {
    ownUrl, competitorUrl,
    missingTopics,
    coveredTopics,
    keywordGaps,
    keywordCovered,
    recommendations: missingTopics.slice(0, 10).map((t) => `Consider covering "${t}" — it appears in the competitor page's headings but not in yours.`),
    note: "Gaps are computed from public headings/text only. They are suggestions to consider, not proof that adding a topic will improve rankings.",
  };
}
