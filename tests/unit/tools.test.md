# Unit test checklist — tools (Phase 7: runnable)

Runnable tests: `tests/unit/services.test.mjs` (`npm test`).
They cover pure logic: format helpers (`gcd`, `slugify`), the tool
registry (21 tools, unique slugs/titles/descriptions, ≥3 FAQs, related
links resolve), canonicals/JSON-LD honesty, audit/GSO/AEO scoring,
keyword research (volume/difficulty always `unavailable`), the JSON
envelope, validation and URL validation. **36 tests pass** (see
`docs/TEST_REPORT.md`).

For EACH of the 21 tools (still manual — components are React UI, and
their behaviour is covered only by the e2e smoke test for loading):
- [ ] Empty input → clear validation message, no crash, no result shown.
- [ ] Valid input → correct output (spot-check against the formula/template).
- [ ] Invalid input (oversized file >20 MB, wrong file type, negative numbers, zero followers) → clear error.
- [ ] Copy → clipboard holds exactly the shown result.
- [ ] Reset → all fields and results cleared.
- [ ] Download (where offered) → file downloads and opens correctly.
- [ ] Thumbnail resizer output is exactly 1280 × 720.
- [ ] Earnings calculator labels the result an estimate and shows the formula.
- [ ] Template generators state they use templates, not AI.

Calculators to verify by hand:
- Aspect ratio: 1920×1080 → 16:9; 1080×1920 → 9:16.
- Earnings: 100,000 views × $3 RPM → $300/month.
- Engagement: (1200+80+150) ÷ 20000 × 100 → 7.15%.
- Word counter: "hello world" → 2 words, 11 characters with spaces.
