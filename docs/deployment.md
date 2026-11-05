# Deployment & Rollback — CreatorToolbox

**Status: DEPLOYED to Cloudflare 2026-11-05 ~15:05 PKT.**
Worker live at https://creator-toolbox-api.creator-toolbox.workers.dev
(D1 `creator_toolbox`, 15 tables, migrations 0001–0004 applied;
`ADMIN_TOKEN` set as a Worker secret — value delivered to the owner in
chat only, never stored in this repo or in memory). Pages production
live at https://creator-toolbox-ekw.pages.dev (project
`creator-toolbox`, production branch `main`; first deploy was a preview
on branch `master` — production needs `--branch main`). GitHub Pages
remains live at https://zainmushtaq9.github.io/creator-toolbox/ and
remains the canonical site (`SITE_URL` unchanged, sitemap still lists
github.io URLs). Verification notes: Pages home/sitemap/robots/tool
page all HTTP 200 by curl; Worker `/api/v1/health` could NOT be
verified by curl from this VM (empty reply — the VM's egress proxy
fails on the new workers.dev hostname; verified in the browser instead,
see §5). Every step that needs an account, a key or a decision is
marked as such.

## 0. Prerequisites (owner decisions — none exist yet)

| Item | Where it goes | Status |
| --- | --- | --- |
| Domain name | `frontend/src/config/site.js` (`SITE_URL`), `frontend/public/robots.txt` sitemap line, sitemap URLs | **Not chosen** — still `https://zainmushtaq9.github.io/creator-toolbox` (GitHub Pages is the canonical site; the Cloudflare Pages site serves the same github.io sitemap/canonicals until SITE_URL is changed and the sitemap regenerated) |
| Cloudflare account (free tier) | Worker, D1, Pages, Workers AI binding | **DONE 2026-11-05** — account Zainmushtaq3399@gmail.com's Account (`4fbf954a937c1e97b747e42da1eb1c40`); workers.dev subdomain `creator-toolbox`; API token `creator-toolbox-deploy` created by the owner (never stored in chat/files — used transiently via `CLOUDFLARE_API_TOKEN`); `wrangler login` OAuth timed out 3×, token route used instead. Token quirk: the token lacks User → Memberships → Read, so plain `wrangler d1 ...` fails on `/memberships` (error 9106) — always export `CLOUDFLARE_ACCOUNT_ID=4fbf954a937c1e97b747e42da1eb1c40` alongside the token. |
| GitHub repository | Source hosting + Pages deploys | **DONE 2026-11-05** — https://github.com/ZainMushtaq9/creator-toolbox, PUBLIC since 14:08 PKT; GitHub Pages LIVE at https://zainmushtaq9.github.io/creator-toolbox/ (Actions workflow, Node 22; verified 14:22 PKT) |
| `ADMIN_TOKEN` (long random value) | Worker secret | **DONE 2026-11-05** — generated (64 hex chars) and set with `wrangler secret put ADMIN_TOKEN`; value delivered to the owner in chat only, never stored in this repo, in files or in memory. |
| Google Cloud OAuth client (web app) | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OAUTH_ENCRYPTION_KEY` (Worker secrets); redirect URI `https://<worker>/api/v1/gsc/callback` | **Not created** |
| Google AI Studio key (optional, long-context overflow only) | `GEMINI_API_KEY` (Worker secret) | **Not supplied** |
| AI fallback keys (optional, all fallbacks) | `HF_API_TOKEN`, `ANYROUTER_API_KEY`, `GROQ_API_KEY`, `NVIDIA_API_KEY` | **Not supplied** — none required for the default |
| GA4 measurement ID (optional) | `frontend/src/config/analytics.js` + `enabled: true` | **Not created** — currently `G-XXXXXXXXXX`, OFF |
| AdSense publisher ID + approval (optional) | `frontend/src/config/ads.js` + `frontend/public/ads.txt` | **Not created** — currently `pub-YOUR-PUBLISHER-ID`, OFF |
| Contact email | `frontend/src/config/site.js` (`CONTACT_EMAIL`) | **Not chosen** — currently `contact@YOUR-DOMAIN` |

**Never deploy the placeholder `ads.txt`.** Replace it with the exact
line from the owner's AdSense account (Sites → your site → ads.txt)
before any deployment that serves it. AdSense approval is not guaranteed.

## 1. Pre-deploy checks (local — all currently passing)

```bash
cd ~/workspace/creator-toolbox
npm run build            # PASS (~4-5 s)
npm run validate:metadata  # 0 errors
npm run validate:links     # 0 broken links
npm run sitemap            # 54 URLs (regenerate after changing SITE_URL)
npm run manifest           # regenerate route-manifest.json
npm run test:all           # 57/57 PASS (unit 36 + backend 16 + e2e 5)
```

## 2. Configure the site (before the first deploy)

1. Set `SITE_URL` to the real domain in `frontend/src/config/site.js`.
2. Set `CONTACT_EMAIL` in the same file.
3. Run `npm run sitemap && npm run manifest && npm run build` again so
   the sitemap, manifest and canonicals use the real domain.
4. Set `ALLOWED_ORIGIN` in `backend/wrangler.toml` to the real site
   origin (CORS allow-list). Leave `AI_PROVIDER = "workers-ai"`.
5. **Do NOT enable analytics or ads yet:** keep `ANALYTICS_CONFIG.enabled`
   `false` and `ADS_CONFIG.enabled` `false` until the GA4 property and
   AdSense approval exist. Enabling them with placeholder IDs loads
   nothing (the GA4 loader refuses placeholder IDs) — but do not rely on
   that; set real IDs first.

## 3. Backend — Cloudflare Workers + D1

```bash
cd backend
npm install
npx wrangler login                    # one-time, owner's Cloudflare account
# NOTE 2026-11-05: `wrangler login` OAuth timed out 3×; used an API
# token instead (CLOUDFLARE_API_TOKEN, transient only) + always export
# CLOUDFLARE_ACCOUNT_ID (see §0 — token lacks Memberships:Read).
# NOTE: a workers.dev subdomain must exist before the first deploy;
# registered via API: PUT /accounts/{id}/workers/subdomain
# {"subdomain":"creator-toolbox"} -> creator-toolbox-api.creator-toolbox.workers.dev
npx wrangler d1 create creator_toolbox   # DONE 2026-11-05, id 18d60a4f-8cad-4bc4-b918-a946770445ae, region WNAM
# Paste the returned database_id into wrangler.toml (replacing
# REPLACE_WITH_REAL_D1_DATABASE_ID), then:
npx wrangler d1 migrations apply creator_toolbox --remote  # DONE, 0001-0004, 15 tables verified
# Verify the schema:
npx wrangler d1 execute creator_toolbox --remote \
  --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
# Expected: 15 tables (14 + tool_usage). Migrations 0001-0004 are
# additive only (indexes/constraints); 0001 holds all tables.
npx wrangler secret put ADMIN_TOKEN
# Optional, only if wanted:
npx wrangler secret put GEMINI_API_KEY        # long-context overflow only
npx wrangler secret put HF_API_TOKEN          # Hugging Face fallback
npx wrangler secret put ANYROUTER_API_KEY     # AnyRouter fallback
npx wrangler secret put GROQ_API_KEY          # Groq fallback
npx wrangler secret put NVIDIA_API_KEY        # NVIDIA fallback
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put OAUTH_ENCRYPTION_KEY
npx wrangler deploy   # DONE 2026-11-05 -> https://creator-toolbox-api.creator-toolbox.workers.dev (v57c041c1)
```

Secrets are set interactively (`wrangler secret put NAME` with no value
on the command line) — never paste a secret into a command, a file, or
chat. **Workers AI needs no secret** — the `[ai]` binding in
`wrangler.toml` is enough (10,000 Neurons/day per account, recurring
forever, resets 00:00 UTC).

## 4. Frontend — Cloudflare Pages

```bash
cd frontend
npm install
npm run build        # output: dist/
```

Pages settings: build command `npm run build`, output directory `dist`,
root directory `frontend` (or deploy from the repo root with the build
command `npm --prefix frontend run build`). Set the environment variable
`VITE_API_URL` to the deployed Worker URL (e.g.
`https://creator-toolbox-api.<subdomain>.workers.dev`) so the SEO
dashboard can call the Worker. Without it, the dashboard runs in local
mode only.

**Deployed 2026-11-05 via CLI (no Git integration):** project
`creator-toolbox` created with production branch `main`
(`wrangler pages project create creator-toolbox --production-branch main`
→ https://creator-toolbox-ekw.pages.dev). Build with
`VITE_API_URL=https://creator-toolbox-api.creator-toolbox.workers.dev
npm --prefix frontend run build` (base `/` by default; do NOT set
`PAGES_BASE_PATH` for Cloudflare — that is GitHub-Pages-only), then
`wrangler pages deploy frontend/dist --project-name creator-toolbox
--branch main --commit-dirty=true`. **The `--branch main` matters:**
the first deploy without it went to branch `master` as a Preview and
the production domain served 404s. Verify the production URL after
every deploy (see §5).

Local quirk (seen 2026-11-05): `vite preview` binds IPv6 localhost
(`[::1]:4173`) on this VM — `http://localhost:4173` works,
`http://127.0.0.1:4173` does not. This does not affect Cloudflare Pages.

## 5. Post-deploy verification (run in order; stop on the first failure)

```bash
WORKER=https://creator-toolbox-api.creator-toolbox.workers.dev
SITE=https://creator-toolbox-ekw.pages.dev
curl -s $WORKER/api/v1/health            # {"success":true,"data":{"status":"ok",...}}
curl -s $WORKER/api/v1/tools/config      # tools: 21
curl -s $WORKER/api/v1/ai/models         # 401 without a token (expected)
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" $WORKER/api/v1/ai/models
# -> provider "workers-ai", configured models listed
curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"task":"seoAnalysis","prompt":"Review the homepage"}' \
  $WORKER/api/v1/ai/recommendations      # mode "live" (Workers AI) or "mock"
curl -s $SITE/ | head -c 200             # 200, HTML shell
curl -s -o /dev/null -w "%{http_code}\n" $SITE/sitemap.xml    # 200
curl -s -o /dev/null -w "%{http_code}\n" $SITE/robots.txt     # 200
curl -s -o /dev/null -w "%{http_code}\n" $SITE/tools/word-counter  # 200
```

**2026-11-05 post-deploy results (curl from this VM):** Pages
`/` `/sitemap.xml` `/robots.txt` `/tools/word-counter` `/llms.txt`
all **200**; homepage serves the real app shell (title + `#root`).
Worker health/tools-config could NOT be checked by curl from this VM
(empty reply / exit 52 — the VM's egress proxy fails on the brand-new
workers.dev hostname; `dash.cloudflare.com` and `workers.cloudflare.com`
curl fine, and `wrangler deployments list` shows the version 100%
deployed) — **verified live via the fetch path 2026-11-05 15:04 PKT:**
`/api/v1/health` → `{"success":true,"data":{"status":"ok",
"service":"creator-toolbox-api","version":"0.1.0","db":true}}`;
`/api/v1/tools/config` → 21 tools, 5 categories; `/api/v1/ai/models`
→ **401 without a token (expected — auth enforced)**. Remaining
browser checks: unlock `/seo` with the `ADMIN_TOKEN` (sessionStorage
only) and confirm the dashboard loads in Worker mode; run one page
audit; check `/seo/search-console` shows NOT CONNECTED until the OAuth
flow is done.

Then, in the browser: open the homepage and 2–3 tool pages (no console
errors); unlock `/seo` with the `ADMIN_TOKEN` (sessionStorage only) and
check the dashboard loads in Worker mode; run one page audit; check
`/seo/search-console` shows NOT CONNECTED until the OAuth flow is done;
if GA4 was enabled, check DebugView for the 9 events; submit the
sitemap in Search Console.

## 6. Git (local only)

```bash
git init
git add -A
git commit -m "Initial commit: CreatorToolbox Phases 1-7 (see docs/phase-reports/)"
```

**No remote is set, nothing is pushed.** Creating the GitHub repository,
adding a remote, or pushing is a separate owner decision (see §0).
Commit per phase for future work; the initial commit covers Phases 1–7
because M1 predates the repo and intermediate snapshots were not
preserved — per-phase detail lives in `docs/phase-reports/phase-N.md`.

**Update 2026-11-05:** the GitHub repo exists
(https://github.com/ZainMushtaq9/creator-toolbox, PUBLIC) and local
`origin` points at it, but local history and GitHub history are
divergent (different SHAs, same content) — a plain `git push` is
rejected. Repo updates go via the browser web UI, or after a history
reconciliation. Local commit `b8b042d` (2026-11-05) holds the Cloudflare
production `wrangler.toml` (real D1 id + Pages origin); GitHub's copy
still has the placeholders — sync it via the browser when convenient
(GitHub Pages deploys do not use `wrangler.toml`, so no impact there).

## 7. Rollback

### Frontend (Cloudflare Pages)
- **Roll back a bad deploy:** Pages → Deployments → pick the previous
  deployment → "Retry deployment" (or "Rollback" if offered). The
  previous build stays available until replaced.
- **Roll back a bad config change** (e.g. wrong `SITE_URL`): fix the
  value, rebuild, redeploy. The site is a static build — no data to
  restore.
- **Emergency:** set the Pages project to a known-good commit, or
  pause the project (Pages → Settings → pause) to stop serving it.

### Backend (Cloudflare Worker)
- **Roll back a bad deploy:** `wrangler deploy` keeps version history —
  `npx wrangler deployments list` then `npx wrangler rollback
  <deployment-id>` (or redeploy the previous git commit's Worker code).
- **Roll back a bad secret:** `npx wrangler secret put <NAME>` with the
  previous value, or `npx wrangler secret delete <NAME>` to return an
  optional fallback to its mock/NOT CONNECTED state. Deleting
  `ADMIN_TOKEN` locks all private endpoints (401) — use deliberately.
- **D1 migrations are additive only** (indexes/constraints in
  0002–0004; all tables in 0001). There is no down-migration. **Never
  run a destructive migration** (DROP/ALTER that loses data) without a
  backup: `npx wrangler d1 export creator_toolbox --remote --output
  backup.sql` before any schema change.
- **If the Worker is broken but the site is fine:** the 21 launch tools
  run in the browser and keep working; only the SEO dashboard's
  Worker-backed features (live AI, GSC sync, server-stored reports)
  degrade to local mode / NOT CONNECTED. The frontend does not depend on
  the Worker to serve tools.

### Full rollback (both)
1. Roll back the Worker first ( §7 backend), then the Pages deployment.
2. Re-run the §5 verification (health, sitemap, a tool page, `/seo`
   unlock).
3. If the domain/DNS changed, revert the DNS record to the previous
   Pages/Worker hostname.

## 8. Ongoing operations

- **Monitoring:** Cloudflare dashboard (Workers invocations/errors, D1
  usage, Pages deploys). Workers AI usage: 10,000 Neurons/day/account;
  overage on the Free plan stops with an error — watch for a sudden
  rise in `mock`/`error` AI responses.
- **Backups:** export D1 before any migration (`wrangler d1 export`).
  Local reports and workspaces live in the visitor's browser
  (localStorage) and are not backed up server-side.
- **Secrets rotation:** rotate `ADMIN_TOKEN` and `OAUTH_ENCRYPTION_KEY`
  by setting a new value with `wrangler secret put` and redeploying;
  rotating `OAUTH_ENCRYPTION_KEY` invalidates stored GSC refresh tokens
  (re-run the OAuth flow afterwards).
- **Updates:** run `npm run test:all` before every deploy; keep the
  phase reports in `docs/phase-reports/` current.
