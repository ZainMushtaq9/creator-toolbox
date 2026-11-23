// Rendered SEO/GSO/AEO audit for the PDF toolkit pages (Patch 050).
// Uses the site's own audit engine (backend/src/services/pageAudit.js,
// gsoAnalysis.js, aeoAnalysis.js) against the browser-rendered DOM of
// each page — the same "rendered audit" the goal log quotes for the
// homepage (SEO 93 / GSO 86 / AEO 7/8 on 2026-11-10).
//
// Run AFTER `npm run build`:  node scripts/audit-pdf-pages.mjs
// Serves frontend/dist with vite preview on port 4176, audits every
// PDF tool page + the /pdf-tools category page, prints a table and
// writes docs/pdf-pages-audit-2026-11-23.json.
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { chromium } from "playwright-core";
import { TOOLS, getCategory } from "../frontend/src/config/tools.js";
import { auditPage } from "../backend/src/services/pageAudit.js";
import { gsoAnalysis } from "../backend/src/services/gsoAnalysis.js";
import { aeoAnalysis } from "../backend/src/services/aeoAnalysis.js";

const PORT = 4176;
const BASE = `http://localhost:${PORT}`;

async function waitForServer(url, tries = 30) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r.ok) return; } catch { /* not up */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("preview server did not start");
}

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  cwd: new URL("../frontend", import.meta.url).pathname,
  stdio: "ignore",
});
await waitForServer(`${BASE}/`);
const browser = await chromium.launch();
const rows = [];

async function auditOne({ slug, path, keyword, questions }) {
  const page = await browser.newPage();
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  const html = await page.content();
  await page.close();
  const url = `https://zainmushtaq9.github.io/creator-toolbox${path}`;
  const seo = auditPage({ url, html, keyword });
  const gso = gsoAnalysis({ url, html, questions });
  const aeo = aeoAnalysis({ url, html, questions });
  const aeoPassed = aeo.checks.filter((c) => c.passed).length;
  rows.push({
    slug, path, keyword,
    seo: seo.score,
    seoFindings: seo.findings.map((f) => `${f.severity}: ${f.evidence}`),
    gso: gso.score,
    gsoFactors: Object.fromEntries(Object.entries(gso.factors).map(([k, v]) => [k, v.score])),
    aeo: `${aeoPassed}/${aeo.checks.length}`,
    aeoFailed: aeo.checks.filter((c) => !c.passed).map((c) => c.name),
  });
  console.log(`${slug.padEnd(18)} SEO ${String(seo.score).padStart(3)}  GSO ${String(gso.score).padStart(3)}  AEO ${aeoPassed}/${aeo.checks.length}${aeo.checks.filter((c) => !c.passed).length ? ` (failed: ${aeo.checks.filter((c) => !c.passed).map((c) => c.name).join(", ")})` : ""}`);
}

try {
  const pdfTools = TOOLS.filter((t) => t.category === "pdf-tools");
  for (const t of pdfTools) {
    await auditOne({
      slug: t.slug,
      path: `/tools/${t.slug}`,
      keyword: (t.keywords || "").split(",")[0].trim(),
      questions: (t.faqs || []).map((f) => f.q),
    });
  }
  const cat = getCategory("pdf-tools");
  await auditOne({ slug: "pdf-tools", path: "/pdf-tools", keyword: "pdf tools", questions: ["What PDF tools are free?", "Can I merge PDFs without uploading them?"] });
  console.log(`\nCategory: ${cat.name} — ${cat.description}`);
  const avg = (k) => Math.round(rows.reduce((s, r) => s + r[k], 0) / rows.length);
  console.log(`\nAverages across ${rows.length} pages: SEO ${avg("seo")}  GSO ${avg("gso")}`);
  writeFileSync(new URL("../docs/pdf-pages-audit-2026-11-23.json", import.meta.url), JSON.stringify({ generatedAt: new Date().toISOString(), method: "Rendered DOM via headless Chromium against vite preview of the production build; site audit engine (pageAudit/gsoAnalysis/aeoAnalysis).", rows }, null, 2));
  console.log("Wrote docs/pdf-pages-audit-2026-11-23.json");
} finally {
  await browser.close();
  server.kill();
}
