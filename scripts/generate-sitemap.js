// Generates frontend/public/sitemap.xml from the single route registry
// (frontend/src/config/tools.js -> publicPages). Run: npm run sitemap
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { SITE_URL } from "../frontend/src/config/site.js";
import { publicPages } from "../frontend/src/config/tools.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const urls = publicPages.map((p) => {
  const change = p.changeFrequency ? `\n    <changefreq>${p.changeFrequency}</changefreq>` : "";
  const prio = p.priority ? `\n    <priority>${p.priority.toFixed(1)}</priority>` : "";
  return `  <url>\n    <loc>${SITE_URL}${p.path}</loc>${change}${prio}\n  </url>`;
}).join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
writeFileSync(join(root, "frontend/public/sitemap.xml"), xml);
console.log(`sitemap.xml written: ${publicPages.length} URLs (SITE_URL=${SITE_URL})`);
if (SITE_URL.includes("YOUR-DOMAIN")) console.warn("WARNING: SITE_URL is still the YOUR-DOMAIN placeholder — replace it before deployment.");
