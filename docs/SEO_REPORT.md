# SEO Report — CreatorToolbox (Phase 7)

**Date:** 2026-11-05
**Scope:** local build + code checks. No Search Console data exists
(the site is not deployed), so no ranking, coverage or Core Web Vitals
field data is claimed here.

**Live-data update (2026-11-08):** the site is deployed and Search
Console data now exists — the living self-audit is in
`docs/SEO_AUDIT.md` (first run 2026-11-08, reel-5 method). This report
remains the Phase 7 build-time record.

## Summary

| Check | Result |
| --- | --- |
| Metadata validation (`validate:metadata`) | **0 errors** — 21 tools, 8 collections, 7 articles, 54 pages |
| Link validation (`validate:links`) | **0 broken links** — 54 public pages |
| Sitemap | 54 URLs, all public pages present, owner-only pages excluded |
| robots.txt | Correct (see below) |
| Unique canonicals | **PASS** — one per tool page, derived from SITE_URL + slug |
| One H1 per page | **PASS** — enforced by `ToolPageLayout` / page components |
| Structured data | Reviewed — accurate, no invented reviews/prices |
| Internal linking | **PASS** — related tools, collections, articles cross-checked |
| Performance (local) | LCP ≤264 ms, CLS ≤0.036, INP proxy ≤32 ms (see below) |
| E2E smoke | 5/5 — pages render, no console errors, no mobile overflow |

## 1. Metadata

`npm run validate:metadata` (also asserted by `tests/seo/seo.test.mjs`):
- 21 tools with unique titles and descriptions (≥40 chars), ≥3 FAQs
  each, related links that resolve to real tools.
- 8 collections reference only real tools; 7 articles are non-thin
  (≥4 body sections) and link to real tools.
- 54 public pages, no duplicate sitemap paths.
- Canonicals: `pageMeta` in `frontend/src/config/seo.js` builds
  `${SITE_URL}${path}` — one canonical per page, unique per tool
  (asserted in tests).

## 2. Sitemap & robots

- `frontend/public/sitemap.xml`: 54 URLs, regenerated with
  `npm run sitemap`. Every `publicPages` entry is present (asserted).
- Owner-only pages are **excluded**: `/seo/*` and `/admin/` do not
  appear in the sitemap (asserted).
- `frontend/public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Disallow: /seo/
  Disallow: /admin/
  Disallow: /api/
  Disallow: /login/
  Disallow: /auth/
  Sitemap: https://YOUR-DOMAIN/sitemap.xml
  ```
- **Before deployment:** replace `https://YOUR-DOMAIN` in the sitemap
  pointer (and in `frontend/src/config/site.js`) with the real domain,
  then submit the sitemap in Search Console.

## 3. Structured data

- Tool pages emit `WebApplication` JSON-LD (name, URL,
  `applicationCategory`, `operatingSystem: Any`, `offers: price 0 USD`)
  and `BreadcrumbList` JSON-LD, built from the same validated tool
  metadata. `WebSite` and `Organization` JSON-LD are available in
  `config/seo.js`.
- **No fake reviews, ratings or prices** — the offer price 0 USD is
  accurate (the tools are free). Verified by code review and by the
  unit test asserting no `aggregateRating` in the tool JSON-LD.
- Not yet validated in Google's Rich Results Test — that needs a public
  URL (deploy-time check).

## 4. Internal linking

- `npm run validate:links`: 0 broken links across 54 public pages.
- Related-tools sections, collection→tool links and article→tool links
  are cross-checked by the metadata validator.
- Breadcrumbs render on tool pages (asserted by the e2e smoke test).

## 5. Performance (local measurement, not production scores)

Measured with headless Chromium against `vite preview` serving the
production build (viewport 1280×800). Raw results:
`docs/perf-local-2026-11-05.json`. After the Phase 6 reserved-space
fix (`.tool-box` min-height 320 px, `.ad-slot` 90 px):

| Page | LCP | CLS | INP proxy* | TTFB |
| --- | --- | --- | --- | --- |
| Home `/` | 264 ms | 0 | — | 16 ms |
| All tools `/tools` | 160 ms | 0 | — | 35 ms |
| Word counter | 136 ms | 0.036 | — | 4 ms |
| Title generator | 140 ms | 0.014 | 32 ms | 3 ms |

Targets: LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms — **all met locally**.
0 JS errors on all measured pages. Before the fix, word-counter CLS
was 0.163 and title-generator CLS was 0.102 (diagnosed: the lazy tool
chunk swapped in after first paint and shifted content below it).

\* INP proxy = longest `event` entry duration from PerformanceObserver
— an approximation, not a certified INP value (real INP needs real user
interaction). One earlier run showed 168 ms on the home page and did
not reproduce; interaction latency varies run to run.

**Caveats:** these are LOCAL numbers on this VM — they are NOT
production scores. Re-measure after deployment with PageSpeed
Insights and Search Console Core Web Vitals.

## 6. SEO Intelligence (Phase 5) — status

- The 11-module dashboard is built and works in local mode; the audit
  engine uses the PDF weights; keyword research never invents volume or
  difficulty; GSC is labelled NOT CONNECTED until the OAuth flow is
  completed with real credentials.
- No Search Console data exists yet (no property, no deployment), so
  nothing in this report is based on live search data.

## 7. Deploy-time SEO checklist

- [ ] Replace `SITE_URL` (`https://YOUR-DOMAIN`) everywhere; regenerate
      the sitemap and route manifest.
- [ ] Deploy the frontend; verify `/sitemap.xml` and `/robots.txt`
      return 200.
- [ ] Submit the sitemap in Google Search Console; verify the property.
- [ ] Spot-check 5 public pages: unique title, unique description,
      correct canonical, one H1, no accidental `noindex`.
- [ ] Validate structured data in Google's Rich Results Test.
- [ ] Re-measure Core Web Vitals (PageSpeed Insights) and confirm
      LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 in the field.
- [ ] Confirm `/seo/*` returns noindex/disallowed behaviour as intended
      (robots-disallow + owner-only auth, not indexed).
