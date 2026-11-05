# SEO test checklist (Phase 7: runnable)

Runnable tests: `tests/seo/seo.test.mjs` (`npm test`) — it runs the two
validators as subprocesses and checks the sitemap, robots file and
canonicals. See `docs/SEO_REPORT.md`.

- [x] `npm run validate:metadata` passes (unique titles/descriptions, ≥3 FAQs/tool, related links resolve, articles non-thin).
- [x] `npm run validate:links` passes (no broken internal links in the manifest).
- [x] `npm run sitemap` regenerates `frontend/public/sitemap.xml` with every public page (54 URLs).
- [x] Sitemap excludes owner-only pages (`/seo/`, `/admin/`).
- [x] robots.txt disallows `/seo/`, `/admin/`, `/api/` and points at the sitemap.
- [x] Every tool page has a unique canonical (derived from SITE_URL + slug).
- [x] Route manifest lists 54+ pages.
- [ ] Manual (needs a deployed URL): sitemap returns 200; robots.txt returns 200;
      every public page has a unique title, unique description, correct canonical,
      one H1, no accidental noindex; structured data validates in Google's
      Rich Results Test; mobile usability acceptable in Search Console.
