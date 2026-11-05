# Phase-End Report — Phase 4 (Backend/Database/AI)

**Phase:** 4 (Backend/Database/AI)
**Date:** 2026-11-05
**Status:** PASS (with external blockers: no live credentials — see §6)

> **ADDENDUM 2 — 2026-11-05 12:07 PKT — Hugging Face added as an
> OPTIONAL FALLBACK (not the default).** Research
> (`docs/huggingface-research-2026-11-05.md`): HF Inference Providers
> at `https://router.huggingface.co/v1` (OpenAI-compatible, chat
> completions only), secret `HF_API_TOKEN` (fine-grained token, ONLY
> "Make calls to Inference Providers"). Models:
> `openai/gpt-oss-120b:fastest` (131,072 ctx), long-context
> `deepseek-ai/DeepSeek-V4.1-Flash:fastest` (1,048,576 ctx, alt
> `zai-org/GLM-5.3-Flash:fastest`), embeddings via the feature-extraction
> API with `BAAI/bge-m3` (per-token prices unverified). Why not default:
> a FREE HF account gets ZERO included Inference Providers credits
> (official pricing page; PRO $9/mo for $2 credits; old $0.10/mo credit
> removed ~15 Oct 2026); live `GET /v1/models` returned 126 chat models,
> ZERO `is_free: true`. Gated Llama models are NOT wired. Never reuse the
> exposed 2026-11-04 chat-shared HF token; the token must be separate
> from the PSX project's token. Until credits or a BYOK key exist, HF
> stays labelled NOT CONNECTED with the dev mock.
>
> **ADDENDUM 2026-11-05 12:04 PKT — provider change (supersedes the
> AnyRouter-default sections below).** After the 13-source free-API
> research (`docs/free-api-research-2026-11-05.md`), the DEFAULT AI
> provider is now **Cloudflare Workers AI** (`env.AI.run`, no key, no
> card, 10,000 Neurons/day per account recurring forever, resets
> 00:00 UTC): chat `@cf/meta/llama-4-scout-17b-16e-instruct` (131K served
> ctx), embeddings `@cf/baai/bge-m3` (1024-dim). **Google AI Studio
> `gemini-2.5-flash`** (up to 1M ctx) is the long-context overflow only,
> behind `GEMINI_API_KEY` (not supplied; exact RPM/RPD unpublished).
> AnyRouter, Groq (`openai/gpt-oss-120b`, 30 RPM / 1,000 req/day /
> 200K tokens/day, no embeddings) and NVIDIA are OPTIONAL FALLBACKS
> only. The code, config, docs and tests were rewired accordingly
> (see "Provider rewire" in §1); the rest of this report stands.
> The video's "unlimited" claim is false for every source; GitHub
> Models, Opencode/Kilo Code, Ollama Cloud, Cerebras, Cohere trial and
> Vercel AI Gateway were NOT wired (see the research doc for why).

## 1. Completed

### API (`/api/v1/`, consistent JSON envelope `{success, data, meta, error}`)
- `GET /health`, `GET /tools/config` — public, envelope format.
- SEO endpoints (owner-only): `POST /keyword/research`,
  `POST /keyword/cluster`, `POST /audit/page`, `POST /audit/compare`,
  `POST /competitor/analyze`, `POST /content/gaps`, `POST /gso/analyze`,
  `POST /aeo/analyze`. Zod validation, structured errors, no stack
  traces/secrets in responses.
- AI endpoints (owner-only): `POST /ai/recommendations`,
  `POST /ai/generate`, `GET /ai/models` — via the provider abstraction
  (`backend/src/services/aiProvider.js`).
- GSC endpoints (owner-only): `GET /gsc/status`, `GET /gsc/connect`
  (HMAC-signed state, 10 min), `GET /gsc/callback`, `GET /gsc/properties`,
  `POST /gsc/sync`, `GET /gsc/performance`, `POST /gsc/inspect`.
- Reports (owner-only): `GET /reports`, `POST /reports` (201),
  `GET /reports/:id`, `DELETE /reports/:id`.
- Admin (owner-only): `GET /admin/health`, `GET /admin/usage`.
- Router rewritten (`backend/src/index.js`): dispatch table, global
  60 req/min/IP rate limit + 10/min per-IP cap on AI endpoints, CORS
  fixed — only the configured `ALLOWED_ORIGIN` is reflected (the old code
  reflected any Origin), generic 500 handler that never leaks internals.

### Services (deterministic, honest)
- `keywordResearch.js` — deterministic long-tail/question suggestions;
  every suggestion `searchVolume:"unavailable"`, `difficulty:"unavailable"`;
  local Jaccard clustering (`method:"local-jaccard"`).
- `pageAudit.js` — regex HTML parsing + audit with the PDF weights
  (metadata 15, contentStructure 15, keywordRelevance 15, technical 20,
  internalLinking 10, images 10, structuredData 5, mobilePerformance 10);
  findings `{category, severity, evidence, recommendation, benefit,
  status:"open"}`; critical noindex always surfaced.
- `competitorAnalysis.js` / `contentGap.js` — public page data only; never
  claims competitor traffic/rankings/private analytics.
- `gsoAnalysis.js` / `aeoAnalysis.js` — PDF weights (GSO: completeness 20,
  factual support 15, originality 15, clarity 10, coverage 10, structure 10,
  entity 5, crawlability 10, freshness 5); AEO: 8 checks, 0–100.
- `searchConsole.js` — read-only scope
  `webmasters.readonly`; `gscStatus` always `connected:false` until a flow
  completes; token exchange/refresh, Search Analytics, site list.

### AI provider — Workers AI (default), Gemini (overflow), fallbacks

> Rewired 2026-11-05 12:04 PKT (see addendum at the top of this report).
> The AnyRouter-default wiring described in the original §1 below is
> superseded; the current wiring is:
- `backend/src/config/aiModels.js` — default provider `workers-ai`;
  chat `@cf/meta/llama-4-scout-17b-16e-instruct`, embeddings
  `@cf/baai/bge-m3`; long-context overflow `gemini-2.5-flash` (1M ctx,
  `GEMINI_API_KEY`); fallbacks `anyrouter` / `groq` / `nvidia` in
  `fallbacks` (each behind its own secret, never the default). The
  Qwen3.8-27B family (262K) is noted as the Workers AI long-context
  runner-up but NO Qwen model ID is wired — its exact ID was not
  confirmed against the live Cloudflare catalog.
- `workersAI.js` — `env.AI.run` chat + embeddings; no binding in the
  environment → labelled dev mock. `geminiAI.js` — native Gemini API
  (`x-goog-api-key`), used only when the estimated input exceeds
  ~100K tokens; no key → `unavailable` with setup instructions.
  `groqAI.js` — OpenAI-compatible `openai/gpt-oss-120b`, `GROQ_API_KEY`.
  `anyrouterAI.js` / `nvidiaAI.js` — fallbacks, unchanged behaviour.
- `aiProvider.js` — dispatch on `AI_PROVIDER` (default `workers-ai`),
  token estimate (`chars/4`) for the Gemini overflow, `listModels`
  returns configured models with a verify note (no invented live
  catalog for Workers AI / Gemini / Groq).
- `backend/wrangler.toml` — `[ai] binding = "AI"` added;
  `AI_PROVIDER = "workers-ai"`.
- `backend/src/routes/admin.js` — reports `aiBound`, `aiMode`
  (`live-possible` when the AI binding or any AI secret is present,
  else `mock-only`), and all AI secrets as booleans only.
- Original AnyRouter-default wiring (superseded, kept for the record):
  `anyrouterAI.js` was written as the default client with the 403/402
  mapping and `aiProvider.js` dispatched to it; it is now the fallback
  client only, using `AI_MODELS.fallbacks.anyrouter` for its models.

### Security / data
- SSRF-safe `fetchPage.js`: rejects localhost/private/loopback/link-local
  (`169.254.`, incl. metadata `169.254.169.254`), HTTP/HTTPS only,
  re-validates every redirect, 2 MB cap, 8 s timeout, HTML-only, never
  executes remote JS. Known limitation: Workers cannot DNS-lookup before
  fetching, so DNS rebinding cannot be fully excluded (documented in file).
- Owner auth: `ADMIN_TOKEN` Bearer, constant-time comparison; with no
  token configured every private endpoint returns 401 (locked by default).
- GSC refresh tokens encrypted with AES-GCM (`OAUTH_ENCRYPTION_KEY`).
- D1: `0001` has all 14 tables + `tool_usage`; `0002`–`0004` filled with
  real indexes/unique constraints (no duplicated tables). Applied cleanly
  to SQLite (`node:sqlite`): **15 tables, 22 `idx_*` indexes**.
- Bug found and fixed by the new tests: `saveAudit`/`saveKeywords`/
  `logAiJob` failed on the `projects` foreign key — `db.js` now upserts
  the project row first (`ensureProject`; also fixed `projects.website_url`
  NOT NULL in that upsert).

### Docs / config
- `docs/api.md` — full Phase 4 API reference with envelope, endpoints,
  examples, AnyRouter pricing truth, GSC and SSRF notes.
- `.env.example` — placeholders only (incl. `ANYROUTER_API_KEY`,
  `NVIDIA_API_KEY`, Google OAuth, `ADMIN_TOKEN`, D1 ID).
- `backend/wrangler.toml` — `ALLOWED_ORIGIN`, `AI_PROVIDER=anyrouter`,
  secret list updated (AnyRouter first).
- `frontend/src/config/aiModels.js` — AnyRouter default (informational
  only; no key in frontend code).
- `backend/tests/worker.test.mjs` — 12 runnable Worker integration tests
  (`npm test` script added to `backend/package.json`).

## 2. Pending

- Live deployment (Cloudflare account + D1 creation + `wrangler deploy`)
  — blocked, see §6.
- Live AnyRouter / Google OAuth verification — blocked, see §6.
- `wrangler dev` local smoke run — not done in this phase (Worker tested
  via `node --test` with a fake D1 instead; `wrangler dev` is a Phase 7
  item if needed).

## 3. Files changed

New: `backend/src/utils/envelope.js`, `backend/src/utils/db.js`,
`backend/src/utils/fetchPage.js`, `backend/src/config/aiModels.js`,
`backend/src/services/anyrouterAI.js`, `backend/src/services/aiProvider.js`,
`backend/src/services/aiMock.js`, `backend/src/services/aeoAnalysis.js`,
`backend/tests/worker.test.mjs`, `.env.example`, `docs/api.md` (rewritten).
Rewritten: `backend/src/services/keywordResearch.js`,
`backend/src/services/pageAudit.js`,
`backend/src/services/competitorAnalysis.js`,
`backend/src/services/contentGap.js`, `backend/src/services/gsoAnalysis.js`,
`backend/src/services/nvidiaAI.js`, `backend/src/services/searchConsole.js`,
`backend/src/routes/seo.js`, `backend/src/routes/ai.js`,
`backend/src/routes/google.js`, `backend/src/routes/reports.js`,
`backend/src/routes/admin.js`, `backend/src/routes/health.js`,
`backend/src/routes/tools.js`, `backend/src/index.js`,
`backend/migrations/0002_keywords.sql`, `0003_audits.sql`,
`0004_search_console.sql`, `backend/wrangler.toml`,
`backend/package.json` (test script), `frontend/src/config/aiModels.js`.
Edited: `backend/src/security/urlValidation.js` (169.254. blocked),
`backend/src/security/rateLimit.js` (`rateLimitKey` added).

## 4. Testing (actual results)

- `node --test tests/worker.test.mjs` (backend) — **16/16 PASS** (after
  the Workers AI rewire + HF fallback; originally 12/12):
  health envelope; 404 envelope; CORS allow-list (allowed origin
  reflected, other origin gets no header); AI 401 without/wrong token;
  AI recommendations return the labelled dev mock (`mode:"mock"`,
  `provider:"workers-ai"`, "NOT production-connected"); AI recommendations
  go live through a stubbed Workers AI binding; AI recommendations fall
  back to the Hugging Face and AnyRouter mocks when selected; over-long
  input overflows to Gemini and reports NOT CONNECTED without a key;
  AI models endpoint reports `@cf/meta/llama-4-scout-17b-16e-instruct`
  configured, `@cf/baai/bge-m3` for clustering and `gemini-2.5-flash`
  for long context; keyword research labels volume/difficulty
  `unavailable`; page audit scores supplied HTML and flags missing alt
  text; SSRF localhost audit rejected (422 `fetch_failed`); reports
  round-trip through the fake D1 (create 201 → list → get → delete);
  GSC status `NOT CONNECTED`; admin health 401 without token,
  `mock-only` with token.
- Migrations applied to `node:sqlite` in-memory DB — **all 4 applied, 15
  tables, 22 indexes**, no errors.
- Frontend build + validate scripts were last run for the Phase 2 gaps
  (build PASS 4.23 s, metadata 0 errors, links 0 broken); the frontend
  config change in this phase is a comment/model-ID-only change — a fresh
  build re-run is scheduled in Phase 5 verification, not claimed here.
- **No live AI call was made** — no Cloudflare account, no Gemini key,
  no HF/AnyRouter/Groq/NVIDIA key exists, and none was created. No live
  Google OAuth call was made. Nothing was deployed.

## 5. Known issues

- `fetchPage` cannot exclude DNS rebinding (Workers have no pre-fetch
  DNS lookup) — documented, accepted risk, mitigated by redirect
  re-validation and caps.
- The embedding model for keyword clustering is intentionally unset;
  clustering uses local Jaccard until an embedding model is verified.
- `wrangler dev` / D1 remote behaviour is untested (no Cloudflare
  account). The Worker was tested with a fake D1 only.

## 6. Deployment status / blockers (external — owner must supply)

**NOT deployed. NOT production-connected.** The live deployment is an
external blocker. To go live the owner must:

1. **Cloudflare (AI + hosting):** create a Cloudflare account →
   `npx wrangler d1 create creator_toolbox` → paste the real
   `database_id` into `backend/wrangler.toml` → `npx wrangler d1
   migrations apply creator_toolbox --remote` → set `ALLOWED_ORIGIN`
   to the real site origin → `npx wrangler secret put ADMIN_TOKEN`.
   The Workers AI binding (`[ai]`) needs NO key — just the account.
   Free limit: 10,000 Neurons/day per account, recurring forever,
   resets 00:00 UTC.
2. **Gemini long-context overflow (only if wanted):** create a free
   Google AI Studio account and a key at https://aistudio.google.com
   → `npx wrangler secret put GEMINI_API_KEY`. Exact free-tier RPM/RPD
   are unpublished — check the AI Studio rate-limit page. Without the
   key, over-long inputs return a clear error; the Workers AI default
   still works.
3. **Optional AI fallbacks (only if wanted):** Hugging Face
   (`HF_API_TOKEN` — free accounts get zero included credits; needs
   purchased credits, PRO, or a BYOK key), AnyRouter
   (`ANYROUTER_API_KEY`, 5-request lifetime trial then Go $2/mo or
   donated BYOK key), Groq (`GROQ_API_KEY`), NVIDIA
   (`NVIDIA_API_KEY`). None is required for the default to work.
4. **Google (Search Console, Phase 5):** Google Cloud OAuth client
   (web application type, redirect URI
   `https://<worker>/api/v1/gsc/callback`) → secrets
   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OAUTH_ENCRYPTION_KEY`.
5. **Domain / hosting / GitHub repo** — not created (separate decisions).

## 7. Acceptance criteria

| Criterion | Result |
| --- | --- |
| All Brief §4 endpoints implemented with the JSON envelope | PASS |
| Zod validation, rate limiting, caps, timeouts, structured errors | PASS |
| D1 migrations complete (14 tables, FKs, indexes, unique constraints) | PASS (verified in SQLite) |
| Real SSRF protection | PASS (tested: localhost rejected) |
| Workers AI default (no key), Gemini long-context overflow, AnyRouter/Groq/NVIDIA optional fallbacks, secrets as Worker secrets only | PASS (rewired 2026-11-05 12:04 PKT; see addendum) |
| Honest free limits documented (Workers AI 10,000 Neurons/day; Gemini RPM/RPD unpublished; AnyRouter 5-request trial, 403/402) | PASS |
| Dev/mock fallback labelled, never a fake live result | PASS (tested) |
| No live call claimed without a binding/key | PASS (none made) |
| Worker integration tests run and pass | PASS (16/16, updated for Workers AI + HF fallback — see §4) |

## 8. Next phase

Phase 5 — SEO Intelligence (11 frontend modules, real deterministic
logic, GSC OAuth flow, server-side auth for `/seo`).
