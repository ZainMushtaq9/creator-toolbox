// Checks: unique titles/descriptions per tool, one H1 per tool page is
// enforced by ToolPageLayout, canonicals derive from SITE_URL + slug.
import { TOOLS, publicPages } from "../frontend/src/config/tools.js";
import { COLLECTIONS } from "../frontend/src/config/collections.js";
import { ARTICLES } from "../frontend/src/config/blog.js";

let errors = 0;
const seen = new Map();
for (const t of TOOLS) {
  for (const field of ["title", "description"]) {
    const key = `${field}:${t[field]}`;
    if (seen.has(key)) { console.error(`DUPLICATE ${field}: ${t.slug} duplicates ${seen.get(key)}`); errors++; }
    seen.set(key, t.slug);
  }
  if (!t.description || t.description.length < 40) { console.error(`SHORT description: ${t.slug}`); errors++; }
  if (!t.faqs || t.faqs.length < 3) { console.error(`FEWER THAN 3 FAQs: ${t.slug}`); errors++; }
  for (const r of t.related || []) {
    if (!TOOLS.find((x) => x.slug === r)) { console.error(`BROKEN related link: ${t.slug} -> ${r}`); errors++; }
  }
}
const paths = publicPages.map((p) => p.path);
const dupes = paths.filter((p, i) => paths.indexOf(p) !== i);
if (dupes.length) { console.error("DUPLICATE sitemap paths:", dupes); errors++; }
for (const c of COLLECTIONS) for (const s of c.tools) {
  if (!TOOLS.find((t) => t.slug === s)) { console.error(`BROKEN collection tool: ${c.slug} -> ${s}`); errors++; }
}
for (const a of ARTICLES) {
  if (!TOOLS.find((t) => t.slug === a.tool)) { console.error(`BROKEN article tool: ${a.slug} -> ${a.tool}`); errors++; }
  if (!a.body || a.body.length < 4) { console.error(`THIN article: ${a.slug}`); errors++; }
}
console.log(`metadata check: ${TOOLS.length} tools, ${COLLECTIONS.length} collections, ${ARTICLES.length} articles, ${publicPages.length} public pages, ${errors} error(s).`);
process.exit(errors ? 1 : 0);
