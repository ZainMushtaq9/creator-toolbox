# Database (Cloudflare D1 — `creator_toolbox`)

Schema: `backend/migrations/0001_initial.sql` — the blueprint §7.3 starting
schema (projects, keywords, competitors, page_audits, seo_recommendations,
gsc_metrics + indexes) plus stub definitions for the remaining tables:
tool_usage, keyword_suggestions, page_snapshots, keyword_comparisons,
gsc_connections (encrypted refresh token + IV — never plain text),
gsc_sync_logs, ai_jobs (model + prompt version recorded), reports, settings.

Rules: ISO 8601 UTC timestamps; foreign keys and indexes; prepared SQL;
unique constraint on (project, date, page, query, country, device) for
gsc_metrics; retention rules for old snapshots (Phase 5); do not store
complete competitor HTML without a clear requirement; do not store temporary
image-processing data in D1.

Status: schema complete in code (0001–0004). Migrations verified by
applying them to an in-memory SQLite database (`node:sqlite`, 2026-11-05):
all 4 applied, 15 tables, 22 `idx_*` indexes. No D1 database has been
created and no migration has been applied remotely — that is a Phase 4
deployment step (see `docs/deployment.md`).

**AI provider change (2026-11-05, supersedes the AnyRouter default):**
after the 13-source free-API research
(`docs/free-api-research-2026-11-05.md`), the default AI provider is now
**Cloudflare Workers AI** (`env.AI.run`, no key, no card, 10,000
Neurons/day per account recurring forever, resets 00:00 UTC;
`@cf/meta/llama-4-scout-17b-16e-instruct`, embeddings `@cf/baai/bge-m3`).
**Google AI Studio `gemini-2.5-flash`** (up to 1M ctx) is the long-context
overflow only, behind `GEMINI_API_KEY` (not supplied; exact RPM/RPD
unpublished). AnyRouter, Groq and NVIDIA are optional fallbacks only.
No account or key has been created; the integration is NOT
production-connected until the Worker is deployed on a Cloudflare account.
