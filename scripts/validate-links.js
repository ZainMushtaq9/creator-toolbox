// Checks internal links in the route manifest: every /tools/*, /collections/*
// and /blog/* path referenced by the registry must exist in publicPages.
import { publicPages, TOOLS } from "../frontend/src/config/tools.js";
import { COLLECTIONS } from "../frontend/src/config/collections.js";
import { ARTICLES } from "../frontend/src/config/blog.js";

const pages = new Set(publicPages.map((p) => p.path));
let errors = 0;
const check = (from, path) => {
  if (!pages.has(path)) { console.error(`BROKEN LINK from ${from}: ${path}`); errors++; }
};
for (const t of TOOLS) check("registry", `/tools/${t.slug}`);
for (const c of COLLECTIONS) check("collections", `/collections/${c.slug}`);
for (const a of ARTICLES) check("blog", `/blog/${a.slug}`);
for (const t of TOOLS) for (const r of t.related || []) check(`tool ${t.slug} related`, `/tools/${r}`);
console.log(`link check: ${pages.size} public pages known, ${errors} broken link(s).`);
process.exit(errors ? 1 : 0);
