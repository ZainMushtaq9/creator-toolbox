# Test Report — CreatorToolbox (Phase 7)

**Date:** 2026-11-05
**Build under test:** production build, `npm run build` PASS (4.12 s,
main bundle ~298 kB, ~92 kB gzip). Node v24.22.1.

## Summary

| Suite | Command | Result |
| --- | --- | --- |
| Unit + security + SEO | `npm test` | **36/36 PASS** |
| Backend Worker integration | `npm run test:backend` | **16/16 PASS** |
| E2E smoke (headless Chromium) | `npm run test:e2e` (after build) | **5/5 PASS** |
| Validators | `npm run validate:metadata` / `validate:links` | 0 errors / 0 broken |
| Full run | `npm run test:all` | **57/57 PASS, exit 0** |

No failing test was hidden, skipped or disabled to reach this result.
Every failure found during the run was fixed in the code or the test
(see "Failures found and fixed").

## Unit tests — `tests/unit/services.test.mjs` (21 tests)

- Format helpers: `gcd(1280, 720) = 80`, `slugify` normalisation.
- Registry: 21 tools, 5 categories, unique slugs/titles/descriptions,
  descriptions ≥40 chars, ≥3 FAQs per tool, related links resolve,
  54 unique public pages.
- Canonicals: `pageMeta` derives unique canonicals from SITE_URL + path.
- JSON-LD honesty: `WebApplication` offer price 0 USD, no
  `aggregateRating`.
- Audit scoring: weights sum to 100 (audit + GSO); a good page scores
  ≥70 with no critical finding; a `noindex` page surfaces a critical
  finding even with a high score; missing alt text / missing title are
  flagged; `parsePage` extracts title, H1s, images, JSON-LD.
- Keyword research: every suggestion has `searchVolume`/`difficulty`
  `unavailable`; clustering is local Jaccard.
- GSO (9 factors) and AEO (8 checks) score 0–100.
- Envelope: success/error shapes, `validateBody` accepts/rejects.
- URL validation: localhost, private, metadata, `ftp:`, `javascript:`
  rejected; public HTTP/HTTPS accepted.

## Security tests — `tests/security/fetch.test.mjs` (8 tests)

- `fetchPage` (stubbed fetch): localhost rejected without fetching;
  redirect followed only after re-validation; redirect to a private
  address rejected; >3 redirects rejected; non-HTML content rejected;
  2 MB size cap enforced.
- Secrets scan: whole repo AND built bundles scanned for real key
  material (AnyRouter/NVIDIA/Groq/Hugging Face/Google keys, real
  AdSense/GA4 IDs, private keys, AWS keys) — none found. Placeholders
  (`sk-ar-v1-YOUR-KEY-HERE`, `pub-YOUR-PUBLISHER-ID`, `G-XXXXXXXXXX`)
  are explicitly allowed.
- No committed `ADMIN_TOKEN` / OAuth secret value; no secret value on a
  `wrangler secret put` command line.

## SEO tests — `tests/seo/seo.test.mjs` (7 tests)

- `validate:metadata` and `validate:links` pass as subprocesses.
- `sitemap.xml` contains all 54 public pages and excludes `/seo/` and
  `/admin/`.
- `robots.txt` disallows `/seo/`, `/admin/`, `/api/` and points at the
  sitemap.
- Every tool page has a unique canonical; route manifest lists 54+ pages.

## Backend Worker tests — `backend/tests/worker.test.mjs` (16 tests)

Fake D1 backed by `node:sqlite` with the real migrations applied
(15 tables, 22 indexes). Covers: health envelope, 404 envelope, CORS
allow-list (allowed origin reflected, other origin gets none), AI 401
without/wrong token, AI dev mock (Workers AI, no binding), AI live via a
stubbed `env.AI` binding, Hugging Face + AnyRouter fallback mocks,
Gemini overflow NOT CONNECTED, AI models endpoint, keyword research,
page audit, SSRF localhost rejection (422), reports round-trip in D1
(create 201 → list → get → delete), GSC status NOT CONNECTED, admin
health (`mock-only`, no secrets).

## E2E smoke tests — `tests/e2e/smoke.test.mjs` (5 tests)

Headless Chromium against `vite preview` serving the production build:
homepage (hero, H1, no console errors); tool directory + search
filtering; 3 tool pages (H1, breadcrumbs, no console errors); sitemap
and robots return 200; mobile 360 px no horizontal overflow.

## Failures found and fixed (nothing hidden)

1. **IPv6 SSRF bypass (real bug, fixed in code).** `validateFetchUrl`
   did not reject `http://[::1]/` because `URL.hostname` keeps the
   brackets (`"[::1]"`) and the private-IP regex is `^`-anchored.
   Fixed in `backend/src/security/urlValidation.js` (strip brackets
   before the check); covered by the unit test.
2. **FK failures in D1 helpers (real bug, fixed in code).**
   `saveAudit`/`saveKeywords`/`logAiJob` failed on the `projects`
   foreign key — `db.js` now upserts the project row first
   (`ensureProject`; also fixed `projects.website_url` NOT NULL in
   that upsert). Found by the Worker tests.
3. **`node --test <dir>` quirk.** This Node version treats a directory
   argument as a file; test scripts now list test files explicitly
   (root `package.json`, `backend/package.json`).
4. **Test-side mistakes (fixed in tests, not code):** wrong relative
   import paths; `parsePage` returns `images` (array) and `jsonLd`
   (array), not `imagesWithAlt`/`hasJsonLd`; one keyword variation
   ("editing video") does not contain the literal seed; `fetchPage`
   localhost error is "Internal hostnames are not allowed."; the
   `wrangler secret put` scan regex matched prose after the command;
   the route manifest shape is `{pages: [...]}`.
5. **CLS breach (fixed in code, Phase 6).** Word-counter CLS 0.163 and
   title-generator CLS 0.102 — fixed with reserved space
   (`.tool-box` min-height 320 px, `.ad-slot` 90 px); re-measured
   0.036 / 0.014. See `docs/phase-reports/phase-6.md` and
   `docs/perf-local-2026-11-05.json`.

## Not covered (honest gaps)

- **Per-tool UI behaviour** (empty/invalid input, copy, reset, download,
  exact 1280×720 thumbnail output, earnings formula spot-checks) is
  still a manual checklist (`tests/unit/tools.test.md`). Only 3 of 21
  tool pages are sampled by the automated e2e test.
- **Interactive flows** (YouTube workflow → workspace, workspaces,
  collections, SEO experiments) are manual (`tests/e2e/smoke.test.md`).
- **Rate limiting** (>60 req/min → 429) is implemented but not exercised
  by an automated test.
- **The 8 s fetch timeout** is implemented, not timed in tests.
- **Live behaviour** (remote D1 migrations, real OAuth flow, live AI
  calls, GA4 DebugView, Rich Results Test) needs a deployed Worker and
  credentials — see `docs/deployment.md` for the deploy-time checks.
- **Frontend unit tests for React components** do not exist (no jsdom /
  testing library was added — deliberately, to avoid new paid tooling
  and heavy dependencies; the e2e smoke test covers the rendered pages).
