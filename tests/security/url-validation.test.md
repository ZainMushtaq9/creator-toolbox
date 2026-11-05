# Security test checklist (Phase 7: runnable)

Runnable tests: `tests/security/fetch.test.mjs` (`npm test`) and the
backend Worker tests (`npm run test:backend`). See
`docs/SECURITY_REPORT.md` for the full findings.

- [x] Private IP / localhost / metadata URLs rejected by `security/urlValidation.js`
      (unit tests; also found and fixed a real bug: IPv6 `[::1]` was not
      rejected because `URL.hostname` keeps the brackets — fixed in
      `urlValidation.js` by stripping brackets before the check).
- [x] Redirect chains re-validated at every hop; >3 redirects rejected
      (`fetchPage` tests with a stubbed fetch).
- [x] Response size cap (2 MB) and timeout (8 s) enforced on fetched pages
      (size cap tested; the 8 s timeout is implemented, not timed in tests).
- [x] OAuth state validated (HMAC-signed, 10 min); tokens encrypted (AES-GCM),
      never plain text (code review + Worker tests).
- [x] Admin routes return 401 without a valid token; no private data leaks
      (Worker tests).
- [x] No secret appears in the repo: secrets scan test greps the whole repo
      AND the built bundles for real key material (AnyRouter/NVIDIA/Groq/
      Hugging Face/Google keys, real AdSense/GA4 IDs, private keys, AWS keys).
- [x] SQL uses prepared statements only (code review; all D1 access goes
      through `backend/src/utils/db.js` and route handlers).
- [ ] Live D1/Worker behaviour (remote migrations, real OAuth flow) — not
      testable without a Cloudflare account; deploy-time checks in
      `docs/deployment.md`.
