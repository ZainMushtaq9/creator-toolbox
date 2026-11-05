// Writes frontend/public/route-manifest.json from the route registry.
// Used by link validation and by future prerendering work.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { publicPages, TOOLS, CATEGORIES } from "../frontend/src/config/tools.js";
import { COLLECTIONS } from "../frontend/src/config/collections.js";
import { ARTICLES } from "../frontend/src/config/blog.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = {
  generatedAt: new Date().toISOString(),
  tools: TOOLS.map((t) => `/tools/${t.slug}`),
  categories: CATEGORIES.map((c) => c.path),
  collections: COLLECTIONS.map((c) => `/collections/${c.slug}`),
  articles: ARTICLES.map((a) => `/blog/${a.slug}`),
  pages: publicPages.map((p) => p.path)
};
writeFileSync(join(root, "frontend/public/route-manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`route-manifest.json written: ${manifest.pages.length} public pages, ${manifest.tools.length} tools.`);
