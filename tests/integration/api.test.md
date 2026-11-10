# Integration test checklist — backend (Phase 7: runnable)

Runnable tests: `backend/tests/worker.test.mjs` (`npm run test:backend`).
**16 tests pass** (see `docs/TEST_REPORT.md`): health envelope, 404
envelope, CORS allow-list, AI 401 without/wrong token, AI dev mock
(Workers AI, no binding), AI live via a stubbed `env.AI` binding,
Hugging Face + AnyRouter fallback mocks, Gemini overflow
NOT CONNECTED, AI models endpoint, keyword research
(volume/difficulty `unavailable`), page audit, SSRF localhost
rejection (422), reports round-trip in D1, GSC status
NOT CONNECTED, admin health (`mock-only`).

Original skeleton checklist (superseded — the stubs are gone):
- [x] `GET /api/v1/health` → 200, `{status:"ok"}`.
- [x] `GET /api/v1/tools/config` → 200, tools: 26.
- [x] `GET /api/v1/admin/usage` → 401 (protected).
- [x] URL validation rejects: `http://localhost/admin`, `http://169.254.169.254/`,
      `http://192.168.1.1/`, `ftp://example.com/`, `javascript:alert(1)`.
- [x] URL validation accepts: `https://example.com/page`.
- [ ] Rate limit: >60 requests/min from one IP → 429. (Implemented in
      the Worker; not yet exercised by an automated test — manual check
      at deploy time, see `docs/TEST_REPORT.md`.)
