# Unit test checklist — tools (Phase 7: runnable)

Runnable tests: `tests/unit/services.test.mjs` + `tests/unit/pdf.test.mjs`
(`npm test`). They cover pure logic: format helpers (`gcd`, `slugify`),
the tool registry (54 tools, unique slugs/titles/descriptions, ≥3 FAQs,
related links resolve), canonicals/JSON-LD honesty, audit/GSO/AEO
scoring, keyword research (volume/difficulty always `unavailable`), the
JSON envelope, validation and URL validation, plus the PDF toolkit's
pdf-lib operations (merge, split, rotate, compress, watermark, page
numbers, images-to-PDF, sign, page-range parsing, .docx generation).
**51 tests pass** (see `docs/TEST_REPORT.md`).

For EACH of the 54 tools (still manual — components are React UI, and
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
- Percentage: 20% of 250 → 50; 50 is 25% of 200; 80 to 100 → +25%.
- Age: born 1 Jan 2000 → 26y 10m 9d on 10 Nov 2026; born 29 Feb 2000 → 26y 8m 12d.
- BMI: 70 kg at 175 cm → 22.86, Healthy; 154 lb at 5 ft 9 in → 22.74.
- Loan/EMI: 100,000 at 10% for 5 years → EMI 2,124.70, total interest 27,482.27.
- Unit converter: 5 km → 3.1069 miles; 2.5 kg → 5.5116 lb; 100 °C → 212 °F.
- Compound interest: 100,000 at 10% compounded monthly for 5 years → 164,530.89 (interest 64,530.89).
- Calorie: man 30y, 80 kg, 180 cm, moderate → BMR 1,780, TDEE 2,759 kcal/day.
- CGPA: 3 cr A + 3 cr B+ + 4 cr A− → 3.67.
- Zakat: net wealth 750,000, silver Rs 450/g (nisab 275,562) → zakat 18,750.
- Gold: 2 tola 22K at Rs 400,000/tola (24K) → 733,333.33.
- Pakistan salary tax: Rs 1,800,000/year → tax 72,000/year (6,000/month), take-home 144,000/month.
- Pakistan electricity bill: 300 units non-protected at July 2025 rates → energy Rs 8,445.
- Mortgage: 10,000,000 home, 2,000,000 down, 12% over 20 years → payment 88,086.89/month.
- Salary to hourly: 1,200,000/year at 40 h/week → 576.92/hour; 500/hour → 1,040,000/year.
- Discount: 5,000 at 20% off → save 1,000, pay 4,000.
- SIP: 10,000/month at 12% for 10 years → 2,323,390.76 (invested 1,200,000).
- Pregnancy: LMP 1 Jan 2026 → due date 8 Oct 2026.
- Time zone: 15 Jan 2026, 12:00 Karachi → 07:00 UTC, 02:00 New York.
- Water intake: 70 kg moderate → 2.45 litres/day.
- Fuel cost: 300 km at 15 km/litre → 20 litres; at Rs 250/litre → Rs 5,000 (16.67/km).
- Word counter: "hello world" → 2 words, 11 characters with spaces.

PDF tools to verify by hand (browser-only parts — PDF.js rendering,
Tesseract OCR, html2pdf capture — have no runnable test):
- Merge: 3-page + 2-page PDF → one 5-page PDF, pages in the set order.
- Split: range 2–3 of a 5-page PDF → 2-page PDF; split-all → one file per page.
- Compress: re-saved file is valid and opens; page says the honest saving (often small).
- Rotate: 90° on all pages; range-only rotation leaves other pages alone.
- Images to PDF: JPG + PNG → one A4 page per image, in order.
- PDF to Images: each page downloads as a PNG/JPG that opens; 2x is sharper than 1x.
- PDF to Text: text-based PDF extracts; scanned PDF shows the empty-text notice + OCR link.
- Watermark: “DRAFT” appears diagonally on every page.
- Page numbers: “1 of 3” style shows the total; start-at works.
- Sign: drawn signature and uploaded PNG both stamp onto the chosen page.
- PDF to Word: .docx opens in Word/LibreOffice with editable paragraphs; layout is NOT preserved (page says so).
- OCR: clear English scan reads correctly; blurry scan shows the proofread warning.
- HTML to PDF: sample invoice renders and downloads; scripts do not run.
