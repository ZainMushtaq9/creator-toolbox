// E2E smoke test (Phase 7) — vite preview + headless Chromium.
// Run: `npm run test:e2e` (repo root) AFTER `npm run build`.
// Checks the production build the way a visitor sees it: pages load,
// H1s and breadcrumbs render, search filters, sitemap/robots answer,
// no console errors, and no horizontal overflow at 360px.
// The interactive workflow (YouTube workflow → workspace, collections,
// SEO experiments) is still manual — see tests/e2e/smoke.test.md.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright-core";

const PORT = 4174;
const BASE = `http://localhost:${PORT}`;
let server;
let browser;

async function waitForServer(url, tries = 30) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`preview server did not start at ${url}`);
}

before(async () => {
  server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
    cwd: new URL("../../frontend", import.meta.url).pathname,
    stdio: "ignore",
  });
  await waitForServer(`${BASE}/`);
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.kill();
});

async function newPage(viewport) {
  const page = await browser.newPage({ viewport: viewport || { width: 1280, height: 800 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  return { page, errors };
}

test("homepage loads with hero, H1 and no console errors", async () => {
  const { page, errors } = await newPage();
  const res = await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  assert.equal(res.status(), 200);
  const h1 = await page.locator("h1").first().textContent();
  assert.ok(h1 && h1.length > 0, "homepage needs an H1");
  const body = await page.locator("body").innerText();
  assert.match(body, /Create\. Optimize\. Convert\. Grow\./);
  assert.deepEqual(errors, []);
  await page.close();
});

test("tool directory loads and search filters the list", async () => {
  const { page, errors } = await newPage();
  await page.goto(`${BASE}/tools`, { waitUntil: "networkidle" });
  const before = await page.locator(".grid .card").count();
  assert.ok(before >= 21, `expected 21 tool cards, got ${before}`);
  await page.locator("#tool-search").fill("thumbnail");
  await page.waitForTimeout(300);
  const after = await page.locator(".grid .card").count();
  assert.ok(after >= 1 && after < before, `search should narrow results (before ${before}, after ${after})`);
  assert.deepEqual(errors, []);
  await page.close();
});

test("tool pages load with H1, breadcrumbs and no console errors", async () => {
  const slugs = ["word-counter", "youtube-title-generator", "image-compressor"];
  for (const slug of slugs) {
    const { page, errors } = await newPage();
    const res = await page.goto(`${BASE}/tools/${slug}`, { waitUntil: "networkidle" });
    assert.equal(res.status(), 200, slug);
    const h1 = await page.locator("h1").first().textContent();
    assert.ok(h1 && h1.length > 0, `${slug} needs an H1`);
    const crumbs = await page.locator(".breadcrumbs").count();
    assert.ok(crumbs >= 1, `${slug} needs breadcrumbs`);
    assert.deepEqual(errors, [], slug);
    await page.close();
  }
});

test("sitemap.xml and robots.txt answer 200", async () => {
  const sitemap = await fetch(`${BASE}/sitemap.xml`);
  assert.equal(sitemap.status, 200);
  const sitemapText = await sitemap.text();
  assert.match(sitemapText, /<urlset/);
  assert.ok(sitemapText.includes("/tools/word-counter"));
  const robots = await fetch(`${BASE}/robots.txt`);
  assert.equal(robots.status, 200);
  const robotsText = await robots.text();
  assert.match(robotsText, /Disallow: \/seo\//);
});

test("mobile 360px: no horizontal overflow on home and a tool page", async () => {
  for (const path of ["/", "/tools/word-counter"]) {
    const { page } = await newPage({ width: 360, height: 800 });
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(overflow <= 1, `${path} overflows by ${overflow}px at 360px`);
    await page.close();
  }
});
