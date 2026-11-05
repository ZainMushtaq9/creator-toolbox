# Security Report — CreatorToolbox (Phase 7)

**Date:** 2026-11-05
**Scope:** code review + runnable tests (`npm test`, `npm run
test:backend`). No live deployment exists, so no live penetration test
was run; live checks are listed under "Deploy-time checks".

## Findings summary

| Area | Result |
| --- | --- |
| Secrets in repo / built bundles | **None found** (automated scan, 8 tests) |
| SSRF protection | **PASS** — 1 real bug found and fixed (IPv6 bypass, see below) |
| Auth on private endpoints | **PASS** — 401 without a valid token; locked by default |
| CORS | **PASS** — only the configured origin is reflected |
| Rate limiting | Implemented (60/min global, 10/min AI); not load-tested |
| Input validation | **PASS** — zod on every POST body; 64 KB body cap |
| D1 queries | Prepared statements only |
| GSC tokens | AES-GCM encrypted; OAuth state HMAC-signed, 10 min expiry |
| Error handling | Structured errors; no stack traces or secrets in responses |
| AI provider keys | No key exists; keys are Worker secrets only, never in code/logs |
| Analytics / ads | OFF by default; no private data sent to GA4 |

## 1. Secrets scan (automated, passing)

`tests/security/fetch.test.mjs` scans the whole repo (excluding
`node_modules`, `.git`, `.wrangler`) AND the built `dist/` bundles for:
AnyRouter keys (`sk-ar-v1-…`), NVIDIA keys (`nvapi-…`), Groq keys
(`gsk_…`), Hugging Face tokens (`hf_…`), Google API keys (`AIza…`),
real AdSense publisher IDs (`pub-\d{10,}`), real GA4 IDs, private-key
headers, AWS keys, Slack tokens. It also checks no `ADMIN_TOKEN` /
`GOOGLE_CLIENT_SECRET` / `OAUTH_ENCRYPTION_KEY` value is assigned in
code and no secret value appears on a `wrangler secret put` command
line. Result: **no hits**. Only documented placeholders exist
(`sk-ar-v1-YOUR-KEY-HERE`, `pub-YOUR-PUBLISHER-ID`, `G-XXXXXXXXXX`,
`REPLACE_WITH_REAL_D1_DATABASE_ID`, empty secret values in
`.env.example`).

## 2. SSRF protection

`backend/src/utils/fetchPage.js` + `backend/src/security/urlValidation.js`:
- HTTP/HTTPS only; rejects localhost, `.local`/`.internal` hostnames,
  private/reserved IPs (10/8, 172.16/12, 192.168/16, 127/8, 169.254/16
  incl. the cloud metadata address, 0.0.0.0, ::1, fe80:, fc00:, fd00:),
  and URLs with embedded credentials.
- Redirects are followed manually and **re-validated at every hop**;
  >3 redirects rejected.
- 2 MB size cap, 8 s timeout, HTML-only content types; remote JS is
  never executed (body treated as text).
- **Bug found and fixed by the tests (2026-11-05):** `http://[::1]/`
  was NOT rejected — `URL.hostname` returns `"[::1]"` with brackets and
  the private-IP regex is `^`-anchored. Fixed by stripping brackets
  from the hostname before the check. Regression test added.
- **Known limitation (documented in the code):** Workers cannot do a
  DNS lookup before fetching, so DNS rebinding cannot be fully
  excluded. Mitigated by redirect re-validation, caps, and never
  executing or trusting fetched content as code.

## 3. Authentication & authorization

- Every private endpoint (`/seo/*`, `/ai/*`, `/gsc/*`, `/reports/*`,
  `/admin/*`) requires a Bearer `ADMIN_TOKEN` checked server-side with a
  constant-time comparison (`backend/src/security/authentication.js`).
- **With no `ADMIN_TOKEN` configured, `isAdmin()` is always false, so
  all private endpoints return 401 — locked by default.** Verified by
  the Worker tests.
- Frontend: the token lives in `sessionStorage` only
  (`ct-admin-token`), never `localStorage`, code or logs; the `/seo`
  dashboard shows a lock screen until a token is entered. In local mode
  (no Worker) there is no server to verify against — the lock screen
  says so explicitly; this is not presented as authentication.
- `robots.txt` disallows `/seo/` and `/admin/`, but that is **not**
  treated as security anywhere — the Worker enforces it.

## 4. CORS

The old Worker reflected any `Origin`. Fixed in Phase 4: only the
`ALLOWED_ORIGIN` env var (the real site origin) is reflected in
`Access-Control-Allow-Origin`; other origins get no CORS header.
Verified by the Worker tests.

## 5. Rate limiting & caps

- Global: 60 requests/min per IP (`rateLimit`); AI endpoints:
  additionally 10/min per IP (`rateLimitKey`). Implemented in
  `backend/src/security/rateLimit.js`; the 429 path is coded but **not
  exercised by an automated test** (in-memory limiter; test at deploy
  time).
- Request bodies: 64 KB cap (`parseJsonBody`); AI prompts: 4,000 chars
  via the API (longer evidence is server-assembled only); AI output:
  1,200 tokens max, 4,000 chars stored; fetch: 2 MB / 8 s (see §2).

## 6. Data handling

- All D1 access uses prepared statements (`backend/src/utils/db.js` and
  route handlers) — no string-built SQL.
- GSC refresh tokens are encrypted with AES-GCM (key from the
  `OAUTH_ENCRYPTION_KEY` Worker secret) and stored as
  `encrypted_refresh_token` + `token_iv` in D1 — never plain text.
- OAuth state is HMAC-signed (SHA-256 of the encryption key) with a
  10-minute expiry and verified on callback.
- Error responses are structured (`{success:false, error:{code,
  message}}`); the Worker catches unexpected errors and returns a
  generic 500 without stack traces (`backend/src/index.js`).
- Analytics: GA4 is OFF by default; when enabled, events carry only
  slugs, paths and counts — never tool inputs, file contents, emails or
  error messages/stacks.
- The 21 launch tools run in the browser; no user files are uploaded.

## 7. AI provider security notes

- Default: Cloudflare Workers AI (`env.AI.run`) — no key at all.
- Gemini overflow: `GEMINI_API_KEY` Worker secret only; free-tier
  prompts may be used by Google to improve its products — never send
  sensitive user data (documented in `docs/api.md`).
- Fallbacks (Hugging Face `HF_API_TOKEN`, AnyRouter
  `ANYROUTER_API_KEY`, Groq `GROQ_API_KEY`, NVIDIA `NVIDIA_API_KEY`)
  are Worker secrets only. **No key exists for any provider**; nothing
  was created, and the 2026-11-04 chat-shared HF token (exposed) is
  never reused. AI output is validated (non-empty string, length cap)
  and is a draft only — never auto-published.

## 8. Known risks / deploy-time checks

- **No live verification yet.** Remote D1, the deployed Worker, the
  real OAuth flow and live AI calls have never run. Deploy-time checks
  are listed in `docs/deployment.md` (health, D1 connectivity, secrets,
  OAuth redirect, AI inference, SSRF probe against a test URL).
- **DNS rebinding** (see §2) — accepted, mitigated, documented.
- **Local-mode token unlocking** (see §3) — disclosed, not a boundary.
- **`ads.txt` placeholder** must be replaced with the exact AdSense line
  before deployment; **never deploy `pub-YOUR-PUBLISHER-ID`**.
- **Rate limiting is in-memory per isolate** — under Cloudflare's
  distributed Workers it is approximate, not a hard global cap. Do not
  rely on it as the only abuse control; the AI per-key caps and the
  Neurons/day allowance are the backstops.
