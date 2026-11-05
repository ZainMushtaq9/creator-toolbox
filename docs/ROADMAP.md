# CreatorToolbox Roadmap — 7 Phases

Sequential phases. Each phase is usable before the next, and each has its own
spec, checklist and acceptance criteria. Test each phase before starting the next.

| Phase | Name | Priority | Status |
| --- | --- | --- | --- |
| 1 | Planning and Foundation | P0 | DONE — blueprint/spec approved in chat; this repo is the implementation |
| 2 | Frontend and UI | P0 | DONE (M1) — React 18 + Vite, CSS3, Router, Lucide, homepage, directory, tool pages, search/filter, responsive, light + dark themes (header toggle, saved in localStorage, system preference as default). Gaps closed 2026-11-05: React error boundary + `prefers-reduced-motion` support (see `docs/phase-reports/phase-2-gaps.md`). |
| 3 | Core Tools | P0 | DONE (M1) — 21 browser-local tools with copy/download/reset/validation |
| 4 | Backend, Database and AI | P1 | DONE 2026-11-05 — all Brief §4 endpoints live in code with the JSON envelope; D1 migrations 0001–0004 complete (verified in SQLite: 15 tables, 22 indexes); Worker integration tests PASS (`backend/tests/worker.test.mjs`). **AI provider is Cloudflare Workers AI (default, `env.AI.run`, no key — 10,000 Neurons/day forever), Gemini `gemini-2.5-flash` is the long-context overflow (GEMINI_API_KEY, not supplied), Hugging Face / AnyRouter / Groq / NVIDIA are optional fallbacks only.** No live key exists yet — AI returns a labelled dev mock; NOT production-connected. See `docs/phase-reports/phase-4.md`. Deployment still blocked on Cloudflare account + D1 creation + secrets (see phase report §6). |
| 5 | SEO Intelligence | P1 | DONE 2026-11-05 — all 11 modules built (Dashboard, Keyword Research, Competitor Analysis, Page Audit, Keyword Gap, Search Console, AEO, GSO, AI Recommendations, Reports, Settings) with real deterministic logic, local mode + Worker mode, sessionStorage-only token, lock screen; GSC labelled NOT CONNECTED, AI never faked in local mode. Build PASS 4.67 s, metadata/links 0 errors. See `docs/phase-reports/phase-5.md`. Live use still blocked on Worker deployment + credentials. |
| 6 | SEO, Analytics and Monetization | P1 | DONE 2026-11-05 — metadata/canonicals/H1 verified (0 errors), sitemap 54 URLs, robots correct, structured data reviewed, links 0 broken; all 9 GA4 events wired but config-gated OFF (no private data sent); AdSense safe and OFF (placeholder ads.txt, DO NOT DEPLOY); affiliate disclosure added (no affiliate links exist); legal pages corrected to the real provider stack; performance measured locally (LCP ≤264 ms, CLS ≤0.036 after a reserved-space fix, INP proxy ≤32 ms — local only, not production scores). See `docs/phase-reports/phase-6.md` and `docs/perf-local-2026-11-05.json`. |
| 7 | Testing, Deployment and Growth | P1 | DONE (in code + local verification) 2026-11-05 — runnable tests: 36 unit/security/SEO + 16 backend Worker + 5 e2e smoke = **57/57 PASS** (`npm run test:all`); docs TEST_REPORT, SECURITY_REPORT, SEO_REPORT written; `docs/deployment.md` rewritten (deploy + rollback runbook); `docs/ADMIN_GUIDE.md` added; `.env.example` (placeholders only); API docs with examples in `docs/api.md`. **Nothing deployed** — deployment remains blocked on the owner's Cloudflare account, domain, GitHub repo and secrets (see phase report §6). See `docs/phase-reports/phase-7.md`. |

## Milestones

- **M1 = Phases 1–3**: public website + 21 tools.
- **M2 = Phases 4–5**: backend, AI, SEO Intelligence.
- **M3 = Phases 6–7**: SEO, monetization, deployment prep.
- **All 7 phases are DONE in code and verified locally (2026-11-05);
  nothing is deployed yet — deployment needs the owner's Cloudflare
  account, domain, GitHub repo and secrets.**

## Stage plan (from the adopted strategy)

- **Stage 1 (this build)**: 21 tools + workflows (YouTube full), workspaces (localStorage), collections (8), blog (7 articles), SEO basics, AdSense/GA4 placeholders.
- **Stage 2**: more image + developer tools, SEO Intelligence MVP, Search Console, AEO/GSO, 50 future tools prioritised (SEO + developer first — see `frontend/src/config/futureTools.js` and `docs/ROADMAP.md`).
- **Stage 3**: 50–100 quality tools, more workflows, project saving/export, experiments, affiliates, optional premium much later.

## The 8 development rules

1. The 21 tools are free without mandatory registration.
2. Use free / open-source options where possible.
3. No paid APIs or subscriptions in the initial architecture.
4. Do not claim AI for template tools — label template vs calculation vs AI honestly.
5. Test each phase before starting the next.
6. SEO Intelligence is private / owner-only initially.
7. AdSense approval is not guaranteed — approval depends on Google's review of content, navigation and policy compliance; it can take days to weeks.
8. Keep docs, tests and Git commits going throughout (this repo: `docs/`, `tests/`, commit per phase).

## Completion criteria (M1)

- `npm run build` passes in `frontend/`.
- All 21 tool routes exist in the registry and the sitemap; `npm run validate:metadata` and `npm run validate:links` pass.
- Every tool: empty/invalid input shows a clear message and never crashes; copy/download/reset work.
- No real domain, publisher ID, GA4 ID or API key anywhere in the code.

## Source document (2026-11-05)

The detailed PDF `CreatorToolbox_Complete_Development_Roadmap_2_uzsi.pdf`
(kept at `workspace/user/files/`) is the authoritative version of this roadmap.
A second upload, `CreatorToolbox_Complete_Development_Roadmap_4_jobz.pdf`,
is byte-identical to it (same MD5, 71,965 bytes) — a duplicate, not a new
version. It matches the 7 phases / M1–M3 above and adds, per phase:

- Phase 1: GitHub `creator-toolbox`, `main` / `development` / feature branches;
  decision log, backlog, risk register; dark mode only after the core
  interface is stable (done in M1, after the first build).
- Phase 2: error boundaries, a useful 404 page, keyboard access, visible focus,
  reduced-motion support, no dead buttons or placeholder navigation.
- Phase 3: JPEG-transparency warning, file-size/pixel limits, and the full
  empty/minimum/typical/maximum/malformed test matrix per tool.
- Phase 4: versioned `/api/v1` endpoints (keyword research/cluster, page audit,
  competitor, content gaps, AI recommendations, GSO, GSC connect/callback/
  properties/sync/performance/inspect, reports), a consistent JSON envelope,
  and SSRF rules.
- Phase 5: audit weights — metadata 15, content structure 15, keyword
  relevance 15, technical SEO 20, internal linking 10, images 10, structured
  data 5, mobile/performance 10; keyword research from transparent sources
  only, never inventing volume/difficulty/rankings; no scraping of Google
  SERP HTML.
- Phase 6: never deploy a placeholder `ads.txt` publisher ID; legal
  disclosures must match actual integrations; performance targets LCP ≤2.5s,
  INP ≤200ms, CLS ≤0.1, measured in production, not claimed.
- Phase 7: weekly/monthly/quarterly monitoring cadence; growth only after
  launch (PDF merge/split, QR, JSON formatter, meta tags, colour utilities).

Known gaps against the PDF, checked 2026-11-05 (do not claim M1 is
gap-free): no React error boundary yet; no `prefers-reduced-motion` handling
yet (Phase 2). `/seo` has no real authentication yet — robots-disallow +
sitemap exclusion is not security (PDF §1.2); real server-side auth is a
Phase 5 requirement. `public/ads.txt` still holds the placeholder ID and is
marked DO NOT DEPLOY — it must be replaced with the exact AdSense line
before any deployment.

## Developer Implementation Brief (2026-11-05)

`CreatorToolbox_Developer_Implementation_Brief_3_actq.pdf`
(`workspace/user/files/`, 58,455 bytes) is the developer-facing companion to
the roadmap — same 7 phases, plus:

- Phase 1 tasks: linting/formatting, PR checks, issue backlog, technical
  decision log, risk register, release plan, separate dev/prod config.
  Its final instruction is to submit the Phase 1 implementation plan for
  approval before proceeding — in this project Phase 1 was already approved
  in chat (blueprint + roadmap), and M1 was built on that approval.
- Required public pages add future category shells for PDF Tools, Developer
  Tools and Calculators "where appropriate" — not built in M1 (only the 5
  categories covering the 21 tools exist; no dead/placeholder links were
  added for the future ones).
- Phase-end developer report format (§5): phase, completed/pending tasks,
  files changed, testing with actual pass/fail, known issues, deployment
  status, acceptance criteria pass/fail, next phase + dependencies.
  Adopt this format for the M2/M3 phase reports.
- Final delivery requirements (§6): API docs with example requests/responses,
  `.env.example` with placeholders only (no secrets), GitHub repo + release
  history, deployment/rollback instructions, test reports, SEO docs, admin
  access/configuration instructions, known limitations + quotas.
- Global rules (§4): sequential phases, never mark unfinished work complete,
  report blockers early, never fabricate AI output / search volume / SEO
  difficulty / competitor metrics.

Gaps against the Brief, checked 2026-11-05: no GitHub repository or CI yet
(local files only, no `.github/`); no lint/format config; no `.env.example`;
no API docs with examples (backend is a skeleton). These belong to Phases
1/4/7 delivery, not to M1's tool scope.
