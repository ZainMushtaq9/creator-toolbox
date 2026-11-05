# E2E smoke checklist (Phase 7: runnable + manual remainder)

Runnable tests: `tests/e2e/smoke.test.mjs` (`npm run test:e2e`, after
`npm run build`). **5 tests pass** (see `docs/TEST_REPORT.md`):
- [x] Homepage loads; hero, H1 render; no console errors.
- [x] Search filters the tool directory; category filter works (search covered; category filter is manual below).
- [x] Tool pages load at /tools/<slug> with breadcrumbs + H1 (3 sampled: word-counter, youtube-title-generator, image-compressor).
- [x] sitemap.xml and robots.txt return 200.
- [x] Mobile (360px): no horizontal overflow on home and a tool page.
- [x] No console errors on any tested public page.

Still manual (interactive flows — no browser automation was built for them):
- [ ] YouTube workflow: topic → title → description → tags → thumbnail step → checklist → Save to Workspace → project appears in /workspaces.
- [ ] Workspaces: create project, add note, export JSON, delete item/project.
- [ ] Collections: all 8 pages load with included tools.
- [ ] SEO experiments: save an experiment, add after-28-days values.
- [ ] All 21 tool pages load (only 3 are sampled by the automated test).
- [ ] Category filter buttons on /tools.
