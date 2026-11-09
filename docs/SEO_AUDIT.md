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

### AI-written content gate (reel 14, 2026-11-09)

Method (from the AI-content reel, Ghulam Ali SEO, 2026-11-08): never ship raw one-prompt output — the reel crosses out the prompt "write an article on this keyword". AI-assisted text may ship only if it passes all 7 checks: (1) semantically written, (2) skimmable, (3) better than the top competitor, (4) easy to read, (5) in the audience's native language (for this site: natural English, not stilted or machine-translated text), (6) no grammatical or punctuation mistakes, (7) active voice. If it cannot be written to that standard, do not use it.

How this fits the existing rules: §11 Rule 3 ("do not copy AI-generated text into the site") still stands for raw copied output. This gate governs AI-assisted drafting: a draft must be checked against all 7 criteria and rewritten to verified facts in our own words before it ships. A draft that fails any check is rewritten or dropped, never published as-is.

Verified status for this site (2026-11-09): no raw one-prompt AI output is published on the site — all copy was written for this site and verified in the 2026-11-08 fixes round (76/76 exact-phrase coverage, 143 FAQs verified). Skimmability is already the shape of the site's direct answers, ledes and FAQs (§11 Rule 2). "Better than the top competitor" and "native language" have NOT been formally audited per page — open item 8.

Honest caveats: "writing is Google's top second ranking factor" is the creator's claim — Google publishes no such ranking of writing as the second factor, so no weight is asserted here. The transcript garbles "ranking factor" as "drinking factor"; the on-screen text ("Much more power then you think") confirms the power claim only, not the factor ranking. The reel shows no screenshots, no traffic figures and no example domain, so there is no demo-data caveat to carry. Nothing in this section claims a ranking, traffic or indexing outcome.

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
8. AI-content gate checks — "better than the top competitor" and
   "native language" have not been formally audited per page; run
   them with the active-voice pass (item 5) before any AI-assisted
   text ships.
9. Titles over 60 characters — youtube-earnings-calculator (rendered
   title 64 characters) and jpg-to-png-converter (61) exceed the
   reel-16 under-60 guideline once the " | CreatorToolbox" suffix is
   included; two more sit exactly at 60. Shorten only in a title pass
   (or through the daily check's CTR step if CTR data supports it);
   do not change titles on the guideline alone.
10. Meta descriptions under 150 characters — all 21 descriptions
    measure 95–141 characters, none in the reel-16 150–160 range.
    Decide only with CTR evidence whether to lengthen any;
    descriptions are complete and honest as written.

## How this document is maintained

- The daily check (cron `creator-toolbox-weekly-striking-distance`,
  ~10:17 AM PKT) re-runs the Search Console pass; new verified values
  go here with their date.
- Re-audit after any fix the audit finds. Change a value only with a
  named source and date — never from memory.

## Website launch checklist — 15-point audit (2026-11-08)

Method (from the "Launched a New Website? Do These 15 Things for SEO" reel, Ghulam Ali SEO, 2026-10-18): a fresh site should (1) remove the noindex tag, (2) set up Google Search Console, (3) submit its XML sitemap, (4) request indexing for its homepage, (5) set up Bing Webmaster Tools, (6) install Google Analytics, (7) create a Google Business Profile if eligible, (8) enable HTTPS, (9) test every page on mobile, (10) write a unique title for every page, (11) add a favicon, (12) tell Google its site name, (13) redirect old URLs where necessary, (14) check page speed, (15) allow ChatGPT Search to crawl the site.

Verified status for this site (2026-11-08):

- 1. Noindex — done. No noindex meta on any public page (index.html carries none; robots.txt is Allow: / for all crawlers, disallowing only /seo/, /admin/, /api/, /login/, /auth/). The only "noindex" strings in the repo are in the SEO audit engine code that checks for it.
- 2. Search Console — done. URL-prefix property verified 2026-11-05 via the HTML-file method (account 5439).
- 3. Sitemap submitted — done in part. Submitted 2026-11-08; the file itself is valid and live (HTTP 200, 54 URLs, correct XML) but Search Console still shows "Couldn't fetch", 0 discovered; the daily check owns the re-submit escalation.
- 4. Homepage indexing requested — done. Homepage is indexed (last crawl 5 Nov, 8:35 PM); indexing was also requested for the three unindexed tool pages and the hashtag-generator page has since indexed (last crawl 8 Nov, 2:17 PM).
- 5. Bing Webmaster — done. Set up 2026-11-05; import from Search Console succeeded and the sitemap reads SUCCESS with 54 URLs discovered.
- 6. Google Analytics — not done. The GA4 loader is wired off and no measurement ID exists; that needs a real GA4 property created by the owner (no ID is invented here).
- 7. Google Business Profile — not applicable. This is an international online tools site with no local business or physical location; the reel itself says "if eligible".
- 8. HTTPS — done. Both deployments serve HTTPS (github.io and pages.dev).
- 9. Mobile test — done in part. Responsive audit 39/39 checks, 0 overflow (2026-11-05); a formal per-page mobile test has not been run.
- 10. Unique titles — done. validate:metadata enforces a unique title per tool and reports 0 errors across 54 pages.
- 11. Favicon — done. frontend/public/favicon.svg exists and index.html links it as the site icon.
- 12. Site name — done. WebSite and Organization JSON-LD sit statically in index.html with the name "CreatorToolbox".
- 13. Redirect old URLs — not applicable. New site with no legacy URLs to redirect; the SPA 404.html fallback exists for unknown paths.
- 14. Page speed — done in part. Local measurements only: LCP ≤ 264 ms, CLS ≤ 0.036, INP ≤ 32 ms; production Core Web Vitals are not measured and a per-page PageSpeed check has not been run (see Open items 2 in this document).
- 15. AI-search crawl allowed — done. robots.txt is User-agent: * / Allow: / with no AI-bot disallow anywhere, and llms.txt is live. Note: there is no explicit GPTBot line — AI crawlers are covered by the wildcard Allow.

Honest caveats: the caption lists 15 steps but the video's on-screen checklist shows 11 — favicon, site name, redirects and the mobile test are caption-only and are not spoken or shown. The reel says HTTPS is "not a ranking factor"; Google has confirmed HTTPS is a lightweight ranking signal since 2014, so the reel understates it. Requesting indexing does not assure indexing — this site's own record shows it (title and description pages were requested and are still not indexed). Nothing in this section claims a ranking, traffic or indexing outcome.

## Tool-site keyword mining + semantic terms (reel 12, 2026-11-09)

Method (from the "How to Make Tools Website" video, Ghulam Ali SEO, 2026-02-12): build a tool website in three steps — (1) find an untapped tool niche, (2) build the tool with vibe coding, (3) write semantically optimised content for the tool pages.

Site-level keyword mining (new vs the per-keyword checks already in §2 of this document and in docs/SEO_REPORT.md §10): instead of hunting keywords one by one, find a whole tool site with low authority and high traffic, then mine its entire keyword set — one such site can supply the keyword list for many tool pages. The video's filter example: US keyword database, include a category word (the video uses "calculator"), minimum four-word keywords, lowest domain rating set to 10, and top-five spots held by sites with domain rating under 10. The example run returns about 26,000 keywords by the creator's on-screen count. Those filters and that count are the creator's example, not a measurement for this site; no keyword tool is connected here, so no such list has been produced and no score is invented. Forward rule: when a keyword check is next run, first look for a low-authority, high-traffic tool site in the same category and record its keyword set before checking terms one by one.

Semantic terms for content (new vs the "semantically optimised" line in §3): for each tool topic, get the list of NLP terms that belong to the topic (the video uses NeuronWriter and Rankability for this) and make sure those terms appear in the page copy. The tools named are paid and are not connected under the free-only rule, so no term list has been produced for any tool here; the technique is recorded, not the output. Do not present a guessed term list as a measurement.

Honest caveats: the video's earnings and traffic figures are the creator's claims, unverified by us — his own site at $1,400 a month, a single-tool page with 91,000 visits earning $11,000 a month, another basic tool site at 380,000 visits earning $7,000 a month — and two different dollar figures are given for 91,000-visit examples in the same video, so no figure from it is quoted as a fact for this site. "100+ websites ranked" is the creator's claim. The video points viewers at a keyword tool sold by a third-party reseller for about $20 — do not use reseller or shared paid accounts for this site. The 10 niches and 3 easiest-to-rank sites the video promises are not listed in its transcript, so no niche list is recorded here. Nothing in this section promises a ranking, traffic or indexing outcome.

## On-page checklist — the 8-box per-page gate (reel 16, 2026-11-09)

Method (from the "Master SEO to Get Found on Google + AI Search" reel, Ghulam Ali SEO, 2026-10-04 — the "Last Part" of a Master SEO + AI Search series): every page needs eight boxes ticked — (1) title tag with the keyword, under 60 characters, click-worthy; (2) one H1 per page, the page title carrying the keyword; (3) H2 carrying the primary keyword as the main section heading; (4) H3 for the remaining headings and sub-sections; (5) a short, descriptive URL carrying the keyword; (6) a meta description of 150–160 characters written like ad copy — it does not help ranking but boosts CTR; (7) internal linking to money pages, the most important step, never skipped; (8) image optimization — descriptive file names, keywords in alt text, images in WebP format always.

Measured status for this site (2026-11-09, measured from the repo — titles and descriptions counted from frontend/src/config/tools.js; headings from frontend/src/components/ToolPageLayout.jsx):

- Title tag — 19 of 21 rendered titles are 60 characters or under (rendered title = tool.title + " | CreatorToolbox"). Two exceed 60: youtube-earnings-calculator at 64 and jpg-to-png-converter at 61; two more sit exactly at 60 (youtube-thumbnail-resizer, instagram-engagement-calculator). The tool.title field alone is at most 47 characters — the brand suffix is what pushes the two over. Open item 9.
- One H1 — PASS on all 21 tool pages. ToolPageLayout renders exactly one <h1>{tool.name}</h1> and the H1 carries the keyword (it is the tool name).
- H2 carries the keyword — PARTIAL. Each tool page has 6 H2s; only 1 of the 6 carries the keyword ("How to use the {tool.name}"). The other 5 are fixed template labels shared by all 21 pages (Supported formats and limitations; Example use cases; Tool facts; Frequently asked questions; Related tools). The reel's model is one H2 as the main section; this site deliberately uses H2s as section labels. Recorded as a measured difference, not a defect — no heading change is made on the guideline alone.
- H3 — hierarchy is H1 → 6 H2s → H3 related-tool names (4 per page). PASS as designed; it differs from the reel's model (reel: H3 for all other sub-sections; site: H3 for related tool names only).
- URL — PASS. All 21 slugs are short, descriptive keyword slugs with no IDs or parameters.
- Meta description — 0 of 21 in the reel's 150–160 range. Measured lengths run 95–141 characters (shortest: tiktok-hashtag-generator, 95; longest: instagram-caption-generator, 141). The validator only requires ≥ 40 characters and uniqueness, which all 21 meet. Descriptions are complete honest sentences; the 150–160 range is the reel's guideline, not adopted as a target without CTR evidence. Open item 10.
- Internal linking — PASS. Every tool page links to 4 related tool pages (validator-checked, 0 broken), plus breadcrumbs and the shared nav; patch 036 closed the no-JavaScript gap. For this site the tool pages are the money pages (the AdSense inventory), so the related-tools block serves that role.
- Image optimization — NOT APPLICABLE to current pages. The only site image is favicon.svg; there are no content images and no og:image (verified reel 5, re-confirmed 2026-11-09: frontend/public/ holds only favicon.svg). WebP-always is recorded here as the rule for any future content or og:image. User-upload previews are client-side, not site assets; their alt text is descriptive (verified reel 5).

Honest caveats: the reel shows no traffic data and no Search Console screenshots — its slides are illustrative mockups (placeholder domain "yoursite.com", mock code snippets), so there is no demo-data caveat to carry beyond that. The end card repeats the creator's "100 sites ranked" claim (same claim as reel 7), unverified by us. The reel promotes his free SEO course on every frame and points to the full video on YouTube, which was not reviewed here. The under-60 title and 150–160 description figures are the creator's guidelines: Google truncates long titles and shows roughly 150–160-character snippets, but neither figure is a ranking rule, and the meta description does not affect ranking — the reel itself says so. Nothing in this section claims a ranking, traffic or indexing outcome.
