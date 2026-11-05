// AEO — Answer Engine Optimization diagnostic (Roadmap PDF §5.7 / §9).
// Checks whether a page answers questions directly: a short direct answer
// early, question-led headings, definitions, examples, tables, references
// and visible authorship. Scores are a 0–100 diagnostic; AEO does not
// guarantee rich results or AI citations.
import { parsePage } from "./pageAudit.js";

export function aeoAnalysis({ url = "", html = "", text = "", questions = [] }) {
  const page = html ? parsePage(html, url) : null;
  const body = (text || page?.bodyText || "").trim();
  const firstPara = body.split(/\n+/)[0] || body.slice(0, 300);
  const headings = page ? page.headings.flatMap((h) => h.items) : [];
  const questionHeadings = headings.filter((h) => /\?$/.test(h.trim()) || /^(how|what|why|when|where|is|can|should|do|does)\b/i.test(h));
  const checks = [];
  const add = (name, passed, evidence, recommendation) => checks.push({ name, passed, evidence, recommendation });

  add("Direct answer early",
    firstPara.length > 40 && firstPara.length < 400,
    `First paragraph is ${firstPara.length} characters.`,
    "Open with a direct answer to the page's main question in 1–3 sentences.");
  add("Question-led headings",
    questionHeadings.length > 0,
    `${questionHeadings.length} question-led heading(s) found.`,
    "Use real user questions as H2 headings (e.g. 'What is a word counter?').");
  add("Definition present",
    /\b(is|are|means|refers to)\b/i.test(body.slice(0, 1000)),
    body.slice(0, 1000).length > 0 ? "Checked the opening text for a definition." : "No text to check.",
    "Define the main term simply in the introduction.");
  add("Examples present",
    /\b(for example|e\.g\.|example)\b/i.test(body),
    /\b(for example|e\.g\.|example)\b/i.test(body) ? "An example marker was found." : "No example marker found.",
    "Add a realistic example showing the tool or idea in use.");
  add("Tables used",
    /<table/i.test(html || ""),
    /<table/i.test(html || "") ? "A table was found." : "No table found.",
    "Use a table when comparing options, sizes or prices.");
  add("References / sources",
    /https?:\/\//.test(body) || (page?.links.length || 0) > 0,
    `${page?.links.length || 0} link(s) found.`,
    "Cite a reliable source for factual claims.");
  add("FAQ section",
    /faq/i.test(body) || headings.some((h) => /faq|frequent/i.test(h)),
    headings.some((h) => /faq|frequent/i.test(h)) ? "An FAQ heading was found." : "No FAQ section found.",
    "Answer real follow-up questions in a short FAQ — for readers, not only for search.");
  add("Authorship visible",
    /\b(by|author|reviewed by)\b/i.test(body.slice(0, 2000)),
    "Checked the text for an author/review note.",
    "Identify the publisher and, where relevant, who reviewed the content.");

  const passed = checks.filter((c) => c.passed).length;
  const score = Math.round((passed / checks.length) * 100);
  const qs = (questions || []).filter(Boolean);
  return {
    url, score, checks,
    questionsAnswered: qs.map((q) => ({ question: q, answered: body.toLowerCase().includes(q.toLowerCase().replace(/^(how|what|why|when|where|is|can|should|do|does)\s+/i, "").split(" ").filter((w) => w.length > 3)[0] || "") })),
    note: "AEO diagnostic only. Genuine FAQ content can help visitors; Google deprecated the FAQ rich result, so FAQs are scored for readers, not for rich-result chasing.",
  };
}
