# Admin Guide — CreatorToolbox

**Audience:** the site owner only. This guide explains how to configure
and use the private parts of CreatorToolbox (the Worker API and the SEO
Intelligence dashboard). **Deployed 2026-11-05** — Worker at
https://creator-toolbox-api.creator-toolbox.workers.dev, Pages at
https://creator-toolbox-ekw.pages.dev; see `docs/deployment.md` for the
deployment runbook.

## 1. What "admin" means here

- **ADMIN_TOKEN** — a long random token, stored as a Cloudflare Worker
  secret (`wrangler secret put ADMIN_TOKEN`). It is the only credential
  for the private API and the SEO dashboard. **With no token configured,
  every private endpoint returns 401 — locked by default.**
- **Private endpoints** — everything under `/api/v1/seo/*`, `/api/v1/ai/*`,
  `/api/v1/gsc/*`, `/api/v1/reports/*`, `/api/v1/admin/*`. Public
  endpoints are only `GET /api/v1/health` and `GET /api/v1/tools/config`.
- **The dashboard** — `/seo` and its 11 modules (Dashboard, Keyword
  Research, Competitor Analysis, Page Audit, Keyword Gap, Search
  Console, AEO, GSO, AI Recommendations, Reports, Settings). It is
  disallowed in `robots.txt` and excluded from the sitemap.

## 2. First setup (after deployment)

1. Deploy the Worker (see `docs/deployment.md` §3) and set
   `ADMIN_TOKEN` as a Worker secret.
2. Deploy the frontend with `VITE_API_URL` set to the Worker URL.
3. Open `https://YOUR-DOMAIN/seo`. The lock screen asks for the admin
   token. Paste it and click Unlock.
4. The token is stored in **this tab's session storage only**
   (`ct-admin-token`). It is cleared when the tab closes, never written
   to localStorage, code or logs, and never displayed back. Click "Lock
   dashboard" (or clear it in Settings) to lock again.
5. The header shows the API mode: **Worker** (API configured + token
   present) or **Local (browser)** (no API configured — all modules run
   their deterministic local engine; nothing is sent to a server).

## 3. Using the dashboard

- **Keyword Research** — enter a seed term. Suggestions are deterministic
  variations; search volume and difficulty are always `unavailable`
  (never invented). Use the cluster view to group near-duplicates.
- **Page Audit** — enter a URL and optionally paste HTML. The audit
  scores 0–100 with the documented weights and lists findings with
  severity, evidence, recommendation and benefit. A critical `noindex`
  finding is shown even when the score is high. When the Worker is
  configured, the audit is stored in D1 (Reports).
- **AI Recommendations** — pick a task, write a prompt, get a draft.
  Results show their mode (`live`/`mock`), provider and model. **AI
  output is a draft only** — check it against the audit evidence, then
  save it to Reports with status "pending approval". Nothing is ever
  published or applied automatically.
- **Search Console** — shows NOT CONNECTED until the OAuth flow is done
  (see §4). After connecting, sync pulls Search Analytics for your own
  verified property into D1; the Performance view reads the stored rows.
- **Reports** — lists stored reports (Worker) or local reports (browser
  localStorage, labelled local-only). Delete what you no longer need.
- **Settings** — the honest configuration page: AI provider and limits,
  API URL/mode, token management (change/clear), Search Console status.
  No secret is ever displayed there.

## 4. Connecting Google Search Console

1. In Google Cloud Console, create an OAuth client (web application
   type). Authorised redirect URI:
   `https://<worker>/api/v1/gsc/callback`.
2. Set the Worker secrets: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
   `OAUTH_ENCRYPTION_KEY` (a long random value — it encrypts the stored
   refresh token with AES-GCM).
3. In the dashboard, open Search Console → Connect. You are redirected
   to Google; approve the **read-only** scope
   (`webmasters.readonly`) for your verified CreatorToolbox property.
4. Google returns to the callback; the Worker exchanges the code,
   encrypts the refresh token and stores it in D1 (`gsc_connections`).
5. Pick the property and run a sync (site URL, start/end dates). Metrics
   are first-party Search Console data for your own property only.
6. **Rotating `OAUTH_ENCRYPTION_KEY` invalidates stored tokens** —
   re-run the OAuth flow afterwards.

## 5. AI providers (what is configured, what is not)

| Provider | Role | Needs from you |
| --- | --- | --- |
| Cloudflare Workers AI | **Default** — chat `@cf/meta/llama-4-scout-17b-16e-instruct`, embeddings `@cf/baai/bge-m3` | Nothing (the `[ai]` binding; 10,000 Neurons/day/account, recurring forever, resets 00:00 UTC) |
| Google Gemini `gemini-2.5-flash` | Long-context overflow only (input > ~100K tokens) | `GEMINI_API_KEY` — free key from aistudio.google.com; exact RPM/RPD unpublished |
| Hugging Face Inference Providers | Optional fallback | `HF_API_TOKEN` — fine-grained token, ONLY "Make calls to Inference Providers". Free accounts get zero included credits; needs purchased credits, PRO ($9/mo), or a BYOK key. Never reuse the exposed 2026-11-04 token. |
| AnyRouter | Optional fallback | `ANYROUTER_API_KEY` — 5-request lifetime trial, then Go $2/mo or donated BYOK key |
| Groq | Optional fallback | `GROQ_API_KEY` — 30 RPM, 1,000 req/day, 200K tokens/day; no embeddings |
| NVIDIA | Optional fallback | `NVIDIA_API_KEY` — trial-only terms |

Switch the active provider with the `AI_PROVIDER` var in
`backend/wrangler.toml` (`workers-ai` | `gemini` | `huggingface` |
`anyrouter` | `groq` | `nvidia`) and redeploy. With no binding/key
for the selected provider, AI endpoints return a labelled dev mock —
never a fake live result. Check the current state at
`GET /api/v1/admin/health` (Bearer `ADMIN_TOKEN`): `aiMode` is
`live-possible` or `mock-only`, and `secretsConfigured` lists each
secret as a boolean only (values are never shown).

## 6. API quick reference

Full reference with examples: `docs/api.md`. Common calls (all need
`Authorization: Bearer $ADMIN_TOKEN` except the two public ones):

```bash
WORKER=https://creator-toolbox-api.<subdomain>.workers.dev
curl -s $WORKER/api/v1/health
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" $WORKER/api/v1/admin/health
curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keyword":"video editing"}' $WORKER/api/v1/keyword/research
curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/page","html":"<html>…</html>"}' \
  $WORKER/api/v1/audit/page
```

## 7. Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| Dashboard shows "Locked" | No token in this tab — paste `ADMIN_TOKEN` and Unlock. |
| Worker calls return 401 | Token does not match the server-side `ADMIN_TOKEN`, or no token is set server-side. Re-set the secret and redeploy. |
| Dashboard runs in "Local (browser)" mode | `VITE_API_URL` is empty — set it to the Worker URL and rebuild/redeploy the frontend. |
| AI returns a dev mock | No AI binding/key for the selected provider. Default Workers AI needs the deployed Worker with the `[ai]` binding; fallbacks need their secret. Check `/admin/health`. |
| AI returns `unavailable` / Gemini NOT CONNECTED | Input exceeded the Workers AI window and no `GEMINI_API_KEY` is set — shorten the input or set the key. |
| Search Console shows NOT CONNECTED | Google OAuth credentials are not set or the flow was not completed — see §4. |
| A tool page is blank | The ErrorBoundary caught a render error — use "Try again" / "Go to homepage", and report the console error. |
| Ads show the placeholder text | AdSense is OFF (expected until approval). Do not deploy the placeholder `ads.txt`. |

## 8. Security reminders

- Never share `ADMIN_TOKEN` or any secret in chat, email, screenshots
  or code. Rotate a token immediately if it leaks
  (`wrangler secret put ADMIN_TOKEN`, then redeploy).
- The token in your browser tab is session-only; close the tab when
  done on a shared computer.
- Back up D1 before any migration (`wrangler d1 export`).
- The 21 public tools do not depend on the Worker — if the Worker is
  down, the site still serves tools; only dashboard live features
  degrade to local mode.
