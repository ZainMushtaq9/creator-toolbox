# CreatorToolbox — Keyword Map (2026-11-05)

Honest keyword strategy. No search volume, difficulty, or ranking numbers are
claimed anywhere in this file — volume/difficulty are **unavailable** (the
site's own keyword research never invents them), and Search Console has no
query data yet (property verified 2026-11-05, sitemap re-submitted, awaiting
Google's re-read). Difficulty reads below come from checking who actually
ranks on each term with a live search on 2026-11-05.

## Head term — homepage

| Page | Target | Read |
| --- | --- | --- |
| `/` (homepage) | **free online tools** | Hard. Page 1 is big directories: ToolsTide (998 tools, 26 categories), ToopTools (200+ tools), All-WebTools (102+ tools), HelpfulToolsOnline. A 21-tool site does not outrank them on the head term quickly. Keep it as the homepage head target, but expect traffic to come through the long-tail tool pages first. |

## Long-tail targets — one per tool page (the winnable path)

Each tool page targets its own specific term. These pages rank on relevance
and page quality, not on site authority, so they are the realistic entry
points. Competitors on these terms are mostly single-purpose pages with rich
content (definition, how-it-works, comparison/spec table, FAQ, author byline,
updated date) — which is why every tool page now carries a definition lede,
a Tool facts table, an example, FAQs with FAQPage JSON-LD, and an
authorship/updated line.

| Tool page | Primary target | Secondary terms |
| --- | --- | --- |
| `/tools/youtube-title-generator` | youtube title generator | video title ideas, catchy youtube titles, youtube video title generator, youtube title ideas |
| `/tools/youtube-description-generator` | youtube description generator | video description template, youtube description template, youtube video description |
| `/tools/youtube-hashtag-generator` | youtube hashtag generator | youtube hashtags, video hashtags, hashtags for youtube shorts, youtube hashtags to copy and paste |
| `/tools/youtube-tag-generator` | youtube tag generator | youtube tags, video tags, youtube tags generator |
| `/tools/youtube-thumbnail-resizer` | youtube thumbnail resizer | 1280x720 thumbnail, resize thumbnail, youtube thumbnail size |
| `/tools/video-aspect-ratio-calculator` | aspect ratio calculator | video aspect ratio, 16:9 calculator, 9:16 calculator, 4:3 calculator, 21:9 calculator, image aspect ratio calculator |
| `/tools/youtube-earnings-calculator` | youtube earnings calculator | youtube money calculator, youtube rpm calculator, how much does youtube pay per view, youtube pay per 1000 views |
| `/tools/youtube-shorts-title-generator` | youtube shorts title generator | shorts title ideas, youtube shorts titles, youtube shorts title ideas |
| `/tools/instagram-caption-generator` | instagram caption generator | instagram captions, caption ideas, captions for instagram, instagram reels caption |
| `/tools/instagram-hashtag-generator` | instagram hashtag generator | instagram hashtags, instagram hashtags for reels, instagram hashtag limit |
| `/tools/instagram-bio-generator` | instagram bio generator | instagram bio ideas, instagram profile bio |
| `/tools/instagram-post-size-calculator` | instagram post size | instagram dimensions, instagram image size, instagram story size, instagram reel size |
| `/tools/instagram-engagement-calculator` | instagram engagement calculator | engagement rate calculator, instagram engagement rate checker |
| `/tools/tiktok-hook-generator` | tiktok hook generator | tiktok hooks, video hook ideas, tiktok hook ideas |
| `/tools/tiktok-caption-generator` | tiktok caption generator | tiktok captions, tiktok caption ideas, caption for tiktok |
| `/tools/tiktok-hashtag-generator` | tiktok hashtag generator | tiktok hashtags, hashtags for tiktok, tiktok hashtag ideas, tiktok tag generator |
| `/tools/image-compressor` | image compressor | compress jpg, compress png, reduce image size, photo compressor, compress image online |
| `/tools/image-resizer` | image resizer | resize image online, resize photo, photo resizer, resize photo online |
| `/tools/jpg-to-png-converter` | jpg to png converter | convert jpg to png, jpeg to png converter, convert jpeg to png |
| `/tools/word-counter` | word counter | character counter, count words online, sentence counter, paragraph counter, reading time calculator |
| `/tools/text-case-converter` | text case converter | uppercase lowercase converter, title case converter, sentence case converter, uppercase to lowercase converter |

## Evening round 2026-11-05 — keyword research + on-page additions

Live searches were run for all 21 tools (competitor page titles and angles checked on 2026-11-05). Every tool page gained 1–2 secondary terms in its `keywords` field; a few meta descriptions were reworded to carry the term. The round added 21 new FAQs (with FAQPage JSON-LD), each answering a question people actually search for — not one per tool: 17 pages gained one, the YouTube earnings calculator and the Instagram engagement calculator gained two each, and the Instagram post-size calculator and the TikTok hashtag generator gained none. Two more FAQs, one for each of those two pages, were added on 2026-11-08, bringing the total added to 23. (Correction, 2026-11-08: an earlier version of this section said every tool page gained one new FAQ, and the 941fc20 commit message described the round as adding 23 new FAQs. Verified against the 941fc20 diff, the round added 21 — see the breakdown above.)

Two platform facts were corrected in this round (competitor pages agree, and
the old wording was wrong):

- **Instagram now allows up to 5 hashtags per post** (cut from 30 in
  December 2025; Instagram Help Center states 5). The hashtag generator
  page previously said 30 — its `formats` text, how-to step, FAQ and the
  on-page notice now all say 5. The tool itself still returns 12 tags as a
  pool to choose the best 5 from; only the guidance changed.
- **TikTok's composer caps a caption at 5 hashtags** (rolling out since
  August 2025). The TikTok hashtag page already advised 3–5; its FAQ now
  states the cap.

Deliberately NOT added (checked against what each tool actually does):

- Word counter: no "speaking time", "unique words" or "keyword density" —
  the tool shows words, characters with/without spaces, sentences,
  paragraphs and reading time only.
- Image compressor / resizer: no "compress to 20 KB / 50 KB / 100 KB",
  no "resize by percentage", no batch — the tools use a quality slider and
  exact dimensions only.
- YouTube tag generator: no claim of a 500-character counter — the tool
  does not show one. Its new FAQ states YouTube's 500-character tags-field
  limit as a platform fact and tells users to trim if they run over.
- Text case converter: no "camelCase", "snake_case" or "toggle case" —
  the tool has UPPERCASE, lowercase, Title Case, Sentence case, Capitalized
  Words and aLtErNaTiNg only.
- Earnings calculator: no "youtube cpm calculator" — the tool computes
  from RPM, not CPM. Its new FAQ explains CPM vs RPM instead.
- No "viral", "best" or "#1" wording anywhere; no invented volume,
  difficulty or ranking numbers anywhere.

## What ranking needs (beyond on-page work)

- **Indexing first:** sitemap submitted to Search Console (2026-11-05); Bing Webmaster import still to do. No page can rank before Google indexes it.
- **Time:** a new site with zero authority does not rank in 5 days. Indexing takes days; ranking takes weeks to months. Nothing in this file promises a date.
- **LLM visibility (ChatGPT etc.):** there is no "AI search console". ChatGPT answers from the Bing index, so Bing submission matters; `llms.txt` is live; pages now carry direct answers, definitions, tables, and FAQPage structured data so AI systems can quote them.
- **Next content step (not done yet):** the 7 blog articles target how-to queries (e.g. "how to calculate YouTube earnings"); no new articles were added in this round.

## Keyword intent — match the page to what the searcher wants

Method (from the "Stop Chasing Backlinks" reel, Ghulam Ali SEO, 2026-10-07): before writing a page, ask what the person typing the query actually wants to do — that goal is the keyword's intent. A page that ranks but does not serve the intent earns no use: the reel's example is "best gaming laptop", where the searcher wants 5–10 options compared with their benefits before deciding, so a page that only lists products with little information is useless to them even if it ranks. (The reel's traffic screenshot is the creator's own account, unverified by us — only the method is adopted here, not his numbers.)

Rule for this site: classify every query's intent before writing a FAQ, title, or description for it — use (do it now), learn (answer it), or compare (show options side by side). Then serve that intent first on the page.

Audit (2026-11-08, verified in the repo): all 21 tool pages serve their primary intent. Each tool's interaction sits directly under the H1 and lede, so a use-intent visitor can act at once, and each lede states the outcome in the searcher's words. The 7 blog articles serve learn-intent ("how to…") and link to their tool. The homepage serves discovery intent (search box + all 21 tools + categories). No page on the site is a thin list with no information, and no current keyword carries an unserved comparison intent — the one comparison pair in the set (CPM vs RPM) is answered in the earnings calculator's FAQ.

Intent per tool (primary keyword → intent → how the page serves it):

- youtube-title-generator — use → generator at top; lede promises titles and title ideas from a topic.
- youtube-description-generator — use → generator at top; structured description (hook, summary, timestamps, call to action).
- youtube-hashtag-generator — use → generator at top; hashtags ready to copy and paste.
- youtube-tag-generator — use → generator at top; broad, specific and long-tail tag suggestions.
- youtube-thumbnail-resizer — use → resizer at top; exactly 1280 × 720.
- video-aspect-ratio-calculator — use → calculator at top; ratios and matching width/height.
- youtube-earnings-calculator — learn + use → calculator plus "How much does YouTube pay per 1,000 views?" and CPM vs RPM FAQs.
- youtube-shorts-title-generator — use → generator at top; short titles under 60 characters where possible.
- instagram-caption-generator — use → generator at top; captions by topic and mood for posts and Reels.
- instagram-hashtag-generator — use → generator at top; popular + niche tags, 5-hashtag limit stated.
- instagram-bio-generator — use → generator at top; bio under 150 characters, ready to paste.
- instagram-post-size-calculator — use + learn → calculator at top; sizes in formats and FAQs (feed, Story, Reel, profile picture).
- instagram-engagement-calculator — use + learn → calculator at top; formula shown plus "What is a good engagement rate?" FAQ.
- tiktok-hook-generator — use → generator at top; opening lines for the first 3 seconds.
- tiktok-caption-generator — use → generator at top; captions under the 2,200-character limit.
- tiktok-hashtag-generator — use → generator at top; 10-tag pool to pick at most 5 from (5-hashtag cap stated).
- image-compressor — use → compressor at top; JPG, PNG, WebP, quality slider, local only.
- image-resizer — use → resizer at top; exact dimensions, fit or crop.
- jpg-to-png-converter — use → converter at top; JPG to PNG in the browser, no upload.
- word-counter — use → counter at top; words, characters, sentences, paragraphs, reading time.
- text-case-converter — use → converter at top; UPPERCASE, lowercase, Title Case, Sentence case and more.

The one real GSC query so far ("free online image compressor", 0 clicks / 1 impression, avg. position 98, 8 Nov 2026) is use-intent and the image-compressor page already serves it. When new GSC queries arrive, classify their intent first; a query with no matching intent on its page gets a patch that adds it — a comparison query ("X vs Y", "which …") would need a comparison answer, not another FAQ restating the tool.
