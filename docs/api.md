# API — CreatorToolbox Worker (`/api/v1/`)

Base URL: the deployed Cloudflare Worker URL (set `VITE_API_URL` to it in
the frontend). Local dev: `wrangler dev` in `backend/`.

## Envelope

Every response is JSON in this shape — success and error alike:

```json
{ "success": true, "data": { "..." : "..." }, "meta": { "generatedAt": "…", "source": "worker" }, "error": null }
{ "success": false, "data": null, "meta": { "generatedAt": "…" }, "error": { "code": "validation_error", "message": "…" } }
```

Errors never include stack traces or secrets. Error codes:
`unauthorized` (401), `validation_error`/`invalid_body` (400),
`fetch_failed` (422, page could not be fetched), `rate_limited` (429),
`not_connected` (503, integration not configured), `not_found` (404),
`internal_error` (500).

## Authentication

- Public (no token): `GET /health`, `GET /tools/config`.
- Owner-only (Bearer `ADMIN_TOKEN` Worker secret, constant-time check):
  everything else. **With no `ADMIN_TOKEN` configured, all private
  endpoints return 401 — the API and the SEO dashboard are locked by
  default.** The token is sent in the `Authorization` header; the
  frontend keeps it in `sessionStorage` only, never `localStorage`.

## Rate limits

Global: 60 requests/min per IP. AI endpoints: additionally 10/min per IP.

## CORS

Only the `ALLOWED_ORIGIN` (wrangler `[vars]`, the real site origin) is
reflected in `Access-Control-Allow-Origin`. Other origins get no CORS
header. Set `ALLOWED_ORIGIN` before deploying.

## Endpoints

| Method + path | Auth | Description |
| --- | --- | --- |
| `GET /api/v1/health` | public | `{status:"ok", service, version, db, time}` |
| `GET /api/v1/tools/config` | public | Static catalogue metadata (21 tools, categories) |
| `POST /api/v1/keyword/research` | owner | `{keyword, country?, language?, searchIntent?}` → deterministic long-tail/question suggestions. **Every suggestion has `searchVolume:"unavailable"`, `difficulty:"unavailable"`** — never invented. |
| `POST /api/v1/keyword/cluster` | owner | `{keywords[]}` → local Jaccard clusters (`method:"local-jaccard"`) |
| `POST /api/v1/audit/page` | owner | `{url, html?, keyword?}` → page audit (weights: metadata 15, contentStructure 15, keywordRelevance 15, technical 20, internalLinking 10, images 10, structuredData 5, mobilePerformance 10). Fetches the page when no HTML is supplied (SSRF-protected). Findings have `category, severity, evidence, recommendation, benefit, status`. A critical `noindex` is surfaced even when the score is high. |
| `POST /api/v1/audit/compare` | owner | `{ownUrl, ownHtml, competitorUrl?}` → public-metadata comparison |
| `POST /api/v1/competitor/analyze` | owner | Same as compare (public page data only; never competitor traffic/rankings) |
| `POST /api/v1/content/gaps` | owner | `{ownHtml, competitorHtml, keywords?}` → topics on the competitor page missing from yours |
| `POST /api/v1/gso/analyze` | owner | Generative Search Optimisation score (weights: completeness 20, factual support 15, originality 15, clarity 10, coverage 10, structure 10, entity 5, crawlability 10, freshness 5) |
| `POST /api/v1/aeo/analyze` | owner | Answer Engine Optimisation diagnostic (8 checks, 0–100) |
| `POST /api/v1/ai/recommendations` | owner | `{task: seoAnalysis\|competitorAnalysis\|contentGeneration, prompt, topic?}` → live AI text, or a **labelled dev mock** when no key is configured. Response always includes `evidenceRequired` (draft only, owner approval required, never auto-publishes). |
| `POST /api/v1/ai/generate` | owner | Alias of `/ai/recommendations` |
| `GET /api/v1/ai/models` | owner | Live provider catalog (`source:"live-catalog"`) or configured-only fallback with a warning |
| `GET /api/v1/gsc/status` | owner | `{connected:false, configured, scope, note}` — always `connected:false` until the OAuth flow completes |
| `GET /api/v1/gsc/connect?redirectUri=…` | owner | OAuth authorisation URL (HMAC-signed state, 10 min) |
| `GET /api/v1/gsc/callback?code=…&state=…&redirectUri=…` | owner | Exchanges the code, encrypts the refresh token (AES-GCM), stores it in D1, lists sites |
| `GET /api/v1/gsc/properties` | owner | Sites for the connected account |
| `POST /api/v1/gsc/sync` | owner | `{siteUrl, startDate, endDate}` → pulls Search Analytics into `gsc_metrics` (first-party data only) |
| `GET /api/v1/gsc/performance?siteUrl&startDate&endDate` | owner | Stored metrics from D1 |
| `POST /api/v1/gsc/inspect` | owner | `{siteUrl, url}` → URL Inspection API |
| `GET /api/v1/reports` | owner | List reports (newest first) |
| `POST /api/v1/reports` | owner | `{type, reportData, projectId?}` → 201 `{id}` |
| `GET /api/v1/reports/:id` | owner | One report |
| `DELETE /api/v1/reports/:id` | owner | Delete a report |
| `GET /api/v1/admin/health` | owner | Service + configuration status (no secrets, booleans only) |
| `GET /api/v1/admin/usage` | owner | Same as `/admin/health` |

## AI provider — Cloudflare Workers AI (default), Gemini (overflow), fallbacks

- **Default: Cloudflare Workers AI** — native binding `env.AI.run(model,
  input)` (binding `[ai]` in `wrangler.toml`). **No key, no card, no new
  account** — it uses the Cloudflare account the Worker runs on. Free
  limit: **10,000 Neurons/day per account, recurring forever, resets
  00:00 UTC**; overage on the Free plan stops with an error. Models:
  `@cf/meta/llama-4-scout-17b-16e-instruct` (131K served context) for
  chat tasks, `@cf/baai/bge-m3` (1024-dim, multilingual) for embeddings.
  Model IDs are configurable per task (`WORKERS_AI_MODEL_<TASK>` env
  vars). The Qwen3.8-27B family (262K) is the long-context runner-up on
  Workers AI, but its exact model ID was **not** confirmed against the
  live Cloudflare catalog — no Qwen model ID is wired; verify first.
- **Long-context overflow: Google AI Studio `gemini-2.5-flash`** — used
  ONLY when the estimated input exceeds the Workers AI window (~100K
  tokens, leaving headroom). Up to **1M tokens** context. Free tier, no
  card, no billing account. Key from https://aistudio.google.com, stored
  as Worker secret `GEMINI_API_KEY` (native Gemini API,
  `generativelanguage.googleapis.com/v1beta`). **Exact free-tier RPM/RPD
  are NOT published by Google — no number is claimed here**; check the
  AI Studio rate-limit page. Free-tier prompts may be used by Google to
  improve its products — never send sensitive user data. **NOT
  CONNECTED until the owner supplies the key** — without it, an
  over-long input returns a clear error, not a fake result.
- **Optional fallbacks (never the default, each behind its own secret,
  only if the user supplies a key):**
  - **Hugging Face Inference Providers** — `https://router.huggingface.co/v1`
    (OpenAI-compatible, **chat completions only**), `HF_API_TOKEN`
    (fine-grained token, ONLY the "Make calls to Inference Providers"
    permission). Models: `openai/gpt-oss-120b:fastest` (131,072 ctx);
    long-context `deepseek-ai/DeepSeek-V4.1-Flash:fastest` (1,048,576
    ctx, alt `zai-org/GLM-5.3-Flash:fastest`); embeddings via the
    feature-extraction API with `BAAI/bge-m3` (1024-dim; per-token
    prices unverified). **A free HF account gets ZERO included
    Inference Providers credits** — calls need purchased credits, PRO
    ($9/mo for $2 credits), or a BYOK upstream key in HF settings.
    Gated Llama models (`meta-llama/Llama-3.3-70B-Instruct`,
    `Llama-4-Scout`) are NOT wired. Never reuse the exposed 2026-11-04
    chat-shared HF token; this token must be separate from the PSX
    project's token.
  - **AnyRouter** — `anyrouter/free` at `https://anyrouter.dev/api/v1`,
    `ANYROUTER_API_KEY` (`sk-ar-v1-…`). Free plan is only a **5-request
    lifetime trial**; after that free models return **403
    `free_tier_requires_subscription`** and need Go ($2/mo for $4/mo
    credits, or free Go by donating an eligible BYOK key: DeepSeek,
    Z.ai GLM, Moonshot Kimi). Paid models without credits return **402**.
  - **Groq** — `openai/gpt-oss-120b` at `https://api.groq.com/openai/v1`,
    `GROQ_API_KEY` (`gsk_…`). Free, no card: 30 RPM, 1,000 req/day,
    200,000 tokens/day. **No embeddings** — clustering falls back to
    local Jaccard.
  - **NVIDIA Build** — `https://integrate.api.nvidia.com/v1`,
    `NVIDIA_API_KEY` (`nvapi-…`), trial-only terms. Never reuse another
    project's key.
- **No binding/key = labelled dev mock.** Without the AI binding (local
  test) or without a key for a selected fallback, AI endpoints return
  deterministic template text with `mode:"mock"` and a note saying the
  integration is NOT production-connected. **No live AI call has been
  made from this project** — no Cloudflare account, no Gemini key, no
  fallback key exists yet, and none was created here.
- **Do NOT wire:** GitHub Models (retired 2026-07-30, HTTP 410),
  Opencode/Kilo Code (coding agents, not APIs), Ollama Cloud (free plan
  removed), Cerebras (card required), Cohere trial (1,000 calls/mo,
  non-commercial only), Vercel AI Gateway (card requirement unresolved).
  Never use the lookalike repo `nherx/free-llm-api-resources`.
- **To go live (owner steps):** (1) Cloudflare account + deploy the
  Worker (the AI binding needs no key — just the account). (2) For
  long-context overflow only: create a free key at aistudio.google.com
  → `npx wrangler secret put GEMINI_API_KEY`. (3) Optional fallbacks:
  create keys only if wanted, each via its own
  `wrangler secret put <NAME>`. Verify models first via
  `GET /api/v1/ai/models`.

## Search Console (GSC)

OAuth 2.0, read-only scope `https://www.googleapis.com/auth/webmasters.readonly`.
Refresh tokens are stored encrypted (AES-GCM, key from
`OAUTH_ENCRYPTION_KEY`) in D1 table `gsc_connections`. Only the owner's
verified property is used. With no Google credentials configured, every
GSC endpoint reports `NOT CONNECTED` with setup instructions — never
invented clicks/impressions.

## Fetching pages (SSRF protection)

`fetchPage` rejects localhost, private, loopback, link-local
(`169.254.`) and metadata (`169.254.169.254`) addresses, HTTP/HTTPS only,
re-validates every redirect, 2 MB size cap, 8 s timeout, HTML-only
content types, and never executes remote JS. Note: Workers cannot do a
DNS lookup before fetching, so DNS rebinding cannot be fully excluded.

## D1 schema

14 tables + `tool_usage` in `backend/migrations/0001_initial.sql`;
indexes/constraints in `0002_keywords.sql`, `0003_audits.sql`,
`0004_search_console.sql`. All queries use prepared statements.
See `docs/database.md`.

## Example requests

```bash
# Health (public)
curl https://YOUR-WORKER-URL/api/v1/health

# AI recommendation (owner; returns the labelled dev mock without a key)
curl -X POST https://YOUR-WORKER-URL/api/v1/ai/recommendations \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"task":"seoAnalysis","prompt":"Review the homepage of https://example.com"}'

# Page audit from supplied HTML (owner)
curl -X POST https://YOUR-WORKER-URL/api/v1/audit/page \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/page","html":"<!doctype html><html><head><title>T</title></head><body><h1>H</h1></body></html>"}'

# Keyword research (owner)
curl -X POST https://YOUR-WORKER-URL/api/v1/keyword/research \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keyword":"video editing"}'
```

Conventions: never send private user data or unnecessary page content to
AI endpoints. Never invent search volume, ranking position or keyword
difficulty. AI output is a draft only and is never auto-published.
