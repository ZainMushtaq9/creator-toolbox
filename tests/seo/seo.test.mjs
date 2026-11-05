// SEO tests (Phase 7) — validators, sitemap, robots, canonicals.
// Run: `npm test` (repo root). The validators themselves are the
// automated checks; this file asserts they pass and that the sitemap and
// robots files agree with the route registry.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { TOOLS, publicPages } from "../../frontend/src/config/tools.js";
import { pageMeta } from "../../frontend/src/config/seo.js";
import { SITE_URL } from "../../frontend/src/config/site.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("validate:metadata passes (unique titles/descriptions, FAQs, links)", () => {
  const out = execFileSync("node", ["scripts/validate-metadata.js"], { cwd: ROOT, encoding: "utf8" });
  assert.match(out, /0 error\(s\)/);
});

test("validate:links passes (no broken internal links)", () => {
  const out = execFileSync("node", ["scripts/validate-links.js"], { cwd: ROOT, encoding: "utf8" });
  assert.match(out, /0 broken link\(s\)/);
});

test("sitemap.xml contains every public page", () => {
  const sitemap = readFileSync(join(ROOT, "frontend/public/sitemap.xml"), "utf8");
  assert.ok(sitemap.includes("<urlset"), "sitemap must be a urlset");
  for (const p of publicPages) {
    assert.ok(sitemap.includes(`<loc>${SITE_URL}${p.path}</loc>`), `sitemap missing ${p.path}`);
  }
  const count = (sitemap.match(/<url>/g) || []).length;
  assert.equal(count, publicPages.length);
});

test("sitemap excludes owner-only pages", () => {
  const sitemap = readFileSync(join(ROOT, "frontend/public/sitemap.xml"), "utf8");
  assert.ok(!sitemap.includes("/seo/"), "/seo pages must not be in the public sitemap");
  assert.ok(!sitemap.includes("/admin"), "/admin must not be in the public sitemap");
});

test("robots.txt disallows private areas and points at the sitemap", () => {
  const robots = readFileSync(join(ROOT, "frontend/public/robots.txt"), "utf8");
  for (const path of ["/seo/", "/admin/", "/api/"]) {
    assert.ok(robots.includes(`Disallow: ${path}`), `robots must disallow ${path}`);
  }
  assert.ok(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
});

test("every tool page has a unique canonical", () => {
  const canonicals = TOOLS.map((t) => pageMeta({ title: t.title, description: t.description, path: `/tools/${t.slug}` }).canonical);
  assert.equal(new Set(canonicals).size, TOOLS.length);
});

test("route manifest exists and matches the registry", () => {
  const manifestPath = join(ROOT, "frontend/public/route-manifest.json");
  assert.ok(existsSync(manifestPath), "route-manifest.json must exist (run npm run manifest)");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const pages = manifest.pages || manifest.routes || manifest;
  assert.ok(Array.isArray(pages) && pages.length >= 54, `manifest should list 54+ pages, got ${pages.length}`);
});
