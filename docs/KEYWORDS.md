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
