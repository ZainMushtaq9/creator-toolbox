# CreatorToolbox

Free online tools and AI-powered productivity for everyone.
**Create. Optimize. Convert. Grow.**

Free, all-in-one tools platform for content creators and website owners.
M1 (Phases 1–3): public website + 21 browser-local tools.
M2 (Phases 4–5): backend/AI + SEO Intelligence.
M3 (Phases 6–7): SEO/monetization + testing/deployment prep.
All 7 phases are DONE in code and verified locally (see Status).
**Nothing is deployed yet** — deployment needs the owner's Cloudflare
account, domain, GitHub repo and secrets (see `docs/deployment.md`).

## What is built

- 21 tools, each with its own URL, H1, how-to, formats/limits, examples,
  FAQs and related tools. All run in the browser — no upload, no signup.
  - YouTube (8): title, description, hashtag, tag, thumbnail resizer
    (exactly 1280×720), aspect-ratio calculator, earnings calculator
    (RPM estimate), Shorts titles.
  - Instagram (5): caption, hashtag, bio, post-size calculator,
    engagement calculator.
  - TikTok (3): hook, caption, hashtag.
  - Image (3): compressor, resizer, JPG→PNG (local only).
  - Text (2): word counter, text case converter.
- Workflows: `/workflows` + full YouTube Creator Workflow
  (`/workflows/youtube-creator`) with shared topic state and Save to Workspace.
- Workspaces: `/workspaces` — projects in browser localStorage, export JSON.
- Collections: `/collections` + 8 curated kits.
- SEO experiments tracker: `/seo/experiments` (manual MVP, localStorage,
  no Search Console data fetched or invented).
- Blog: 7 genuine guides. Legal: About, Contact, Privacy, Terms,
  Disclaimer, Cookie Policy.
- SEO: route registry (`frontend/src/config/tools.js`) generates routes,
  sitemap, canonicals and navigation; JSON-LD where accurate; robots.txt.
- **Backend (Phase 4):** Cloudflare Worker with a consistent JSON
  envelope, zod validation, rate limiting, SSRF-safe page fetching,
  D1 migrations (15 tables, 22 indexes), and AI with **Cloudflare
  Workers AI as the default** (`env.AI.run`, no key, 10,000
  Neurons/day) — Gemini 2.5-flash as long-context overflow and
  Hugging Face / AnyRouter / Groq / NVIDIA as optional fallbacks.
  With no key/binding it returns a labelled dev mock — the integration
  is NOT production-connected.
- **SEO Intelligence (Phase 5):** 11 owner-only modules under `/seo`
  (Dashboard, Keyword Research, Competitor Analysis, Page Audit,
  Keyword Gap, Search Console, AEO, GSO, AI Recommendations, Reports,
  Settings) with deterministic local logic + Worker mode; admin token
  in sessionStorage only; GSC labelled NOT CONNECTED.
- **Phase 6:** metadata/canonicals/H1 verified (0 errors), sitemap
  54 URLs, GA4 events wired but config-gated OFF, AdSense safe and OFF
  (placeholder ads.txt — DO NOT DEPLOY), no affiliate links.
- **Phase 7:** 57 runnable tests (all passing), deployment + rollback
  runbook, admin guide, test/security/SEO reports.

## Principles

Free core tools (no subscription required, limits shown openly — never
"100% free forever"), privacy-first local processing, no unnecessary signup,
workflow-oriented, honest AI (template vs calculation vs AI labelled).

## Quick start

```bash
cd frontend
npm install
npm run dev      # local development
npm run build    # production build -> dist/
```

From the repo root:

```bash
npm run sitemap            # regenerate frontend/public/sitemap.xml
npm run validate:metadata  # unique titles/descriptions, FAQs, related links
npm run validate:links     # no broken internal links
npm run manifest           # regenerate route-manifest.json
npm test                   # unit + security + SEO tests (36)
npm run test:backend       # Worker integration tests (16)
npm run test:e2e           # e2e smoke, after `npm run build` (5)
npm run test:all           # everything: 57 tests
```

## Deploy (not done yet — see `docs/deployment.md`)

Frontend: Cloudflare Pages (`npm run build`, output `dist/`).
Backend: Cloudflare Workers + D1 (`wrangler deploy`).
Before launch you must set: real domain (`frontend/src/config/site.js`),
AdSense publisher ID (`config/ads.js`, `public/ads.txt`), GA4 ID
(`config/analytics.js`), `ADMIN_TOKEN` + optional AI/Google secrets
(`wrangler secret put …`). No real domain, ID or key exists in this repo.
Rollback instructions are in `docs/deployment.md` §7.

## Structure

```
creator-toolbox/
  frontend/   # React 18 + Vite app (src/app, components, pages, tools/, seo/, config/, services/, styles/, utils/)
  backend/    # Cloudflare Worker (src/index.js, routes/, services/, security/, utils/, migrations/)
  scripts/    # generate-sitemap, validate-links, validate-metadata, build-route-manifest
  tests/      # runnable: unit / security / seo / e2e (plus the original .md checklists, now updated)
  docs/       # architecture, api, database, deployment, admin guide, test/security/seo reports,
              # seo-guidelines, monetization, ROADMAP, STRATEGY, BLUEPRINT, phase-reports/
```

## Status

- Phase 1 Planning: done. Phase 2 Frontend/UI: done (light + dark themes;
  header toggle, saved in localStorage; error boundary +
  `prefers-reduced-motion` support added 2026-11-05).
- Phase 3 Core Tools: done (21 tools).
- Phase 4 Backend/Database/AI: done 2026-11-05 — all endpoints live in
  code with the JSON envelope; D1 migrations complete (15 tables,
  22 indexes, verified in SQLite); 16 Worker tests PASS. AI: Workers AI
  default, Gemini overflow, HF/AnyRouter/Groq/NVIDIA fallbacks — no live
  key exists, dev mock only.
- Phase 5 SEO Intelligence: done 2026-11-05 — all 11 modules built,
  deterministic logic, local + Worker mode, locked by default.
- Phase 6 SEO/Analytics/Monetization: done 2026-11-05 — validators
  0 errors, GA4 wired OFF, AdSense safe OFF, performance measured
  locally (LCP ≤264 ms, CLS ≤0.036, INP proxy ≤32 ms).
- Phase 7 Testing/Deployment/Growth: done 2026-11-05 (in code + local
  verification) — **57/57 tests PASS**, reports + deployment/rollback
  runbook + admin guide written. **Not deployed** — blocked on owner
  credentials/decisions listed in `docs/deployment.md` §0.

See `docs/ROADMAP.md` for the phase table and the 8 development rules,
and `docs/phase-reports/phase-N.md` for the per-phase reports.
