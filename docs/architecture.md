# Architecture

## Data flows

- Text/image tools: browser → local JavaScript → result. No upload.
- PDF tools (future): browser → PDF library → processed file.
- AI tools (Phase 4+): browser → Worker → NVIDIA endpoint → Worker → browser.
- SEO audits (Phase 5): browser → Worker → target page → extraction → audit engine.
- Search Console (Phase 5): browser → Worker → Google OAuth/API → D1 (encrypted refresh token).
- Analytics: browser → GA4 (disabled by default in Stage 1).
- Advertising: eligible public pages → AdSense (disabled until approval).

## Frontend

Single route registry: `frontend/src/config/tools.js` (`TOOLS`, `CATEGORIES`,
`publicPages`). Routes, sitemap, canonicals, navigation and internal links all
derive from it. SEO metadata: `frontend/src/config/seo.js` + `SeoHead`
(react-helmet-async). Tool pages share `ToolPageLayout` (breadcrumbs, H1,
how-to, formats, examples, FAQs, related tools, AdSlot below the interaction).

Five pillars (`config/pillars.js`) group tools; collections (`config/collections.js`)
bundle existing tools; workflows (`config/workflows.js`) sequence them;
workspaces store results in localStorage; future tools live only in
`config/futureTools.js` (roadmap, not pages).

Note: this is a Vite SPA. There is no SSR. Public pages are crawlable as a
single-page app; `scripts/build-route-manifest.js` produces a route manifest
for future prerendering work. Do not claim SSR exists.

## Backend (skeleton, Phase 4)

Cloudflare Worker (`backend/src/index.js`): `/api/v1/health` and
`/api/v1/tools/config` live; `seo`, `ai`, `google`, `reports` return 501;
`admin` returns 401. Security: `security/urlValidation.js` (SSRF rules),
`security/rateLimit.js` (stub), `security/encryption.js` (Web Crypto AES-GCM),
`security/authentication.js` (admin token stub). D1 schema in
`backend/migrations/0001_initial.sql` (blueprint §7.3 tables + remaining tables
as stubs). AI model names: `frontend/src/config/aiModels.js` placeholders only.
