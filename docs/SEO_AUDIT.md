# CreatorToolbox — Self-audit (living record)

**Method:** the full-site audit framework from Ghulam Ali SEO's reel
"Why Your Website isn't Ranking in Google" (posted 2026-01-13, reel 5,
https://www.facebook.com/reel/1266910191937428/). First run: **2026-11-08**.

**Rule of this document:** every value below is either verified in the
repo or quoted from a named Search Console check with its date. Anything
not measured is marked **NOT MEASURED** — never filled in with a guess,
a tool estimate, or the reel's figures.

## The method (from the reel)

1. Search Console audit: Core Web Vitals, Pages/indexing, Crawl stats.
2. Detailed audits: keyword, content, on-page, technical, backlink.
3. "Figure it out, fix it" — fix what the audit finds, then re-audit.

Two corrections to the reel's wording, recorded so nobody repeats them
as fact:

- Poor Core Web Vitals do **not** make a URL "not eligible for ranking"
  — Core Web Vitals are a ranking signal, not an eligibility gate.
- Crawl rate follows a site's quality and popularity; it is a symptom
  to read, not a lever to pull directly. Fast hosting, a light theme,
  internal linking, publishing frequency and backlinks influence it
  over time.
- The reel points viewers at a paid Chrome extension / Ahrefs access
  sold by a third-party seller. **Do not use reseller or shared paid
  accounts** for this site — no paid tools, no grey-market access.

## 1. Search Console audit (2026-11-08)

### Core Web Vitals

- Local only: LCP ≤ 264 ms, CLS ≤ 0.036, INP proxy ≤ 32 ms (headless
  Chromium against `vite preview`, 2026-11-05; `docs/SEO_REPORT.md` §5,
  raw data `docs/perf-local-2026-11-05.json`).
- Production field data: **NOT MEASURED**. Procedure: PageSpeed Insights
  per URL, or the Search Console Core Web Vitals report when it shows
  data. open item 2.

### Pages / indexing (Search Console, checked 2026-11-08 16:41 PKT)

- Indexed (5 of 7 checked): homepage (last crawl 5 Nov, 8:35 PM),
  word-counter, image-compressor, instagram-caption-generator,
  youtube-hashtag-generator (indexed 8 Nov, last crawl 2:17 PM, after
  the 14:16 indexing request).
- Not indexed (2): youtube-title-generator, youtube-description-generator
  — "Crawled - currently not indexed", last crawl 6 Nov, 8:55 AM.
  Indexing was NOT requested for these two (awaiting decision).
- Indexing → Pages report: "Processing data" (no counts yet).
- Sitemap: Search Console still "Couldn't fetch", 0 discovered
  (re-submitted fresh 8 Nov). The file itself is verified live and
  valid (HTTP 200, 54 URLs, `application/xml`); Bing Webmaster read it
  fine (54 discovered). Do not keep re-submitting blindly — the daily
  check watches it.
- Source: `hidden_files/gsc-performance-2026-11-08.md` (goal workspace).

### Crawl stats

- **NOT YET CHECKED** — nobody has opened Search Console Settings →
  Crawl stats for this property. open item 1 (next Search Console
  browser session).

## 2. Keyword audit

- Primary term per tool: `frontend/src/config/tools.js` `keywords`
  field; strategy in `docs/KEYWORDS.md`. The head term "free online
  tools" is dominated by big directories; the winnable path is the 21
  long-tail tool pages.
- Intent per tool: classified use / learn / compare — `docs/KEYWORDS.md`
  "Keyword intent" section (reel 4, 2026-11-08). All 21 tool pages
  serve their primary intent.
- Competition (DR / KD scores): **NOT MEASURED** — no paid tool
  (Ahrefs / SEMrush) is connected, and no score is invented. Method for
  future checks: open the top 5 results for the term, check whether the
  exact term is in their titles, and note their authority qualitatively;
  never present a guessed score as a measurement.
- Real Search Console queries so far (1): "free online image compressor"
  — 0 clicks, 1 impression, avg position 98 (8 Nov 2026). Use-intent;
  the image-compressor page already serves it. No striking-distance
  query yet (the band is positions 5–20).

## 3. Content audit

- External duplication: all page copy was written for this site; no
  copied content is used. A plagiarism scan (e.g. Copyscape) has NOT
  been run — Copyscape is paid — so this is recorded as "not run", not
  "passed". open item 7.
- Internal duplication: none found. Titles and descriptions are unique
  per tool (validator-enforced), 143 FAQs across 21 tools, each tool
  page has its own how-to, formats and examples.
- Quality (the reel's checklist): semantically optimised — exact-phrase
  coverage 76/76 (audit 2026-11-08); user-first — every lede states the
  outcome in the searcher's words; 100% topic coverage — per-tool FAQs
  + how-to + formats + examples; mistakes — copy verified in the
  2026-11-08 fixes round. Positive language / active voice: NOT
  formally audited — open item 5.
- The 7 blog articles are non-thin (≥ 4 body sections) and link to
  their tools.

## 4. On-page audit (verified 2026-11-08)

- Title carries the keyword: exact-phrase coverage 76/76 across 21
  tool pages (`hidden_files/keyword-coverage-audit-2026-11-08.md`).
- First paragraph (lede) carries the primary term; question-led H2s on
  the homepage; one H1 per page (`ToolPageLayout`).
- Image alt text: the only images on the site are user-upload previews
  in 4 tools (thumbnail resizer, image compressor, image resizer,
  JPG-to-PNG converter) — all 7 carry descriptive alt text. No content
  images, no `og:image`. (Checked in the repo 2026-11-08.)
- Schema: WebApplication + BreadcrumbList + FAQPage JSON-LD on tool
  pages; no fake reviews, ratings or prices. Rich Results Test on live
  URLs: NOT yet run — open item 3.
- Internal links: 0 broken (`validate:links`, 54 public pages).
  External links on pages: NOT inventoried — open item 4.

## 5. Technical audit (verified 2026-11-08 unless noted)

- Load: local LCP ≤ 264 ms (see §1); production field data NOT
  MEASURED.
- Mobile: responsive, 39/39 checks, 0 overflow (5 Nov 2026).
- `robots.txt`: correct — disallows `/seo/`, `/admin/`, `/api/`,
  `/login/`, `/auth/`; allows all crawlers including AI bots.
- Sitemap: 54 URLs, live HTTP 200, valid XML.
- Deep links return HTTP 200 on both deployments (prerendered);
  `404.html` SPA fallback exists.
- HTTPS on both deployments; no insecure-content issue found.
- No broken URL structure; no 404 pages in the registry
  (`validate:links` 0 broken).

## 6. Backlink audit

- **NOT MEASURED** — no backlink tool is connected (Ahrefs / SEMrush
  are paid). No link-building has been done. No backlink,
  dofollow/nofollow, anchor-text or spam-link number is claimed here;
  for a site deployed 5 Nov 2026 the profile is presumably near-zero,
  but that is an expectation, not a measurement.
- Never buy links, and never use reseller / shared paid accounts (see
  the method note above).

## Open items

1. Crawl stats — open Search Console Settings → Crawl stats in the next
   browser session; record total crawl requests / download size / avg
   response time with the date. (Parent / browser.)
2. Production Core Web Vitals — PageSpeed Insights on the homepage + 3
   tool pages; record field LCP / INP / CLS. (Parent / browser or a
   future task.)
3. Rich Results Test on live tool-page URLs. (Open since Phase 7.)
4. External-links inventory on tool pages.
5. Positive-language / active-voice pass on page copy.
6. Backlink profile — only when a legitimate free or owned tool is
   available; never buy links.
7. Plagiarism scan — only if a legitimate free route exists; copy is
   original in-repo writing.

## How this document is maintained

- The daily check (cron `creator-toolbox-weekly-striking-distance`,
  ~10:17 AM PKT) re-runs the Search Console pass; new verified values
  go here with their date.
- Re-audit after any fix the audit finds. Change a value only with a
  named source and date — never from memory.
