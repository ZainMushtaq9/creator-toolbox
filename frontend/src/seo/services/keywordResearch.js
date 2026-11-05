// Keyword research from TRANSPARENT sources only (Roadmap PDF §5.3).
// Inputs: user-entered seed terms, optional Search Console queries (first
// party only), manually saved result URLs. Outputs are deterministic
// variations — long-tail, question and related forms — generated from the
// seed itself. Search volume, keyword difficulty and rankings are NEVER
// invented: every suggestion carries volume: "unavailable" and
// difficulty: "unavailable" unless a real source supplied a value.
// No scraping of Google SERP HTML.
const QUESTION_STARTERS = ["how to", "what is", "why", "best", "how do i", "when to", "where to"];
const LONG_TAIL_PREFIX = ["best", "free", "easy", "simple", "online", "beginner", "top", "how to"];
const LONG_TAIL_SUFFIX = ["for beginners", "online", "free", "2026", "step by step", "for youtube", "for instagram", "for tiktok", "examples", "template", "guide", "tips"];

export function normaliseKeyword(raw) {
  return String(raw || "").trim().toLowerCase().replace(/\s+/g, " ").slice(0, 100);
}

export function generateSuggestions(seed, { country = "US", language = "en", intent = null } = {}) {
  const base = normaliseKeyword(seed);
  if (!base) return { keyword: "", suggestions: [] };
  const out = new Set();
  for (const p of LONG_TAIL_PREFIX) out.add(`${p} ${base}`);
  for (const s of LONG_TAIL_SUFFIX) out.add(`${base} ${s}`);
  for (const q of QUESTION_STARTERS) out.add(`${q} ${base}`);
  const words = base.split(" ");
  if (words.length > 1) {
    out.add(`${words[words.length - 1]} ${words.slice(0, -1).join(" ")}`);
  }
  const suggestions = [...out].filter((s) => s !== base).slice(0, 30).map((suggestion) => ({
    suggestion,
    source: "generated-variation",
    searchVolume: "unavailable",
    difficulty: "unavailable",
    country,
    language,
  }));
  return {
    keyword: base,
    country,
    language,
    searchIntent: intent || guessIntent(base),
    suggestions,
    note: "Suggestions are deterministic variations of your seed term. Search volume and difficulty are unavailable — no source supplied them, and they are never invented.",
  };
}

export function guessIntent(keyword) {
  if (/^(how|what|why|when|where|is|can|should)\b/.test(keyword)) return "informational";
  if (/\b(best|top|review|vs|compare)\b/.test(keyword)) return "commercial";
  if (/\b(buy|price|discount|near me)\b/.test(keyword)) return "transactional";
  return "informational";
}

// Deterministic keyword clustering (no AI needed): group terms by shared
// word stems using Jaccard similarity. Used by POST /keyword/cluster when
// the embedding model is unavailable; labelled as local clustering.
export function clusterKeywords(keywords, { threshold = 0.3 } = {}) {
  const terms = [...new Set((keywords || []).map(normaliseKeyword).filter(Boolean))].slice(0, 200);
  const sets = terms.map((t) => new Set(t.split(" ").filter((w) => w.length > 2)));
  const clusters = [];
  for (let i = 0; i < terms.length; i++) {
    let placed = false;
    for (const c of clusters) {
      const sim = jaccard(sets[i], sets[c.representative]);
      if (sim >= threshold) { c.terms.push(terms[i]); placed = true; break; }
    }
    if (!placed) clusters.push({ name: terms[i], representative: i, terms: [terms[i]] });
  }
  return {
    method: "local-jaccard",
    model: null,
    clusters: clusters.map((c) => ({ name: c.name, terms: c.terms })),
    note: "Local deterministic clustering by shared words. No embedding model was used.",
  };
}

function jaccard(a, b) {
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  const union = new Set([...a, ...b]).size;
  return union ? inter / union : 0;
}
