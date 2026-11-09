// Blog articles (blueprint section 8.5). Each article is genuine useful
// content linked to a tool — not a thin keyword page.
export const ARTICLES = [
  {
    slug: "compress-images-without-losing-quality",
    title: "How to Compress Images Without Losing Too Much Quality",
    description: "Practical steps for shrinking JPG, PNG and WebP files while keeping them looking good — quality settings, formats and common mistakes.",
    tool: "image-compressor",
    date: "2026-11-05",
    body: [
      "Start with the right format. Photos compress best as JPG or WebP; graphics with flat colours and text do better as PNG. Converting a photo to PNG rarely helps — it usually makes the file bigger.",
      "Use a quality setting between 70 and 85 for JPG and WebP photos. Below 60, banding and blocky artefacts become visible, especially in skies and skin tones. Above 90, the file grows fast for almost no visible gain.",
      "Resize before you compress. A 4000-pixel photo displayed at 800 pixels wastes most of its bytes. Shrink the dimensions first, then compress — the Image Resizer and Image Compressor on this site do both, in your browser.",
      "Check the result at 100% zoom, not in a small preview. Zoom into faces, text edges and gradients. If edges look clean and colours look smooth, the setting is fine.",
      "Keep an original. Compression, especially JPG, throws away data permanently. Save the compressed copy separately and keep the original for future edits.",
      "A common mistake is compressing the same file twice. Each JPG save loses a little more quality, so always compress from the original, not from an already-compressed copy.",
      "WebP is usually the smallest choice for photos on the web, often noticeably smaller than JPG at the same quality. Use it when the platform accepts it; fall back to JPG for maximum compatibility.",
      "Keep PNG for images with transparency, screenshots and graphics with sharp text. PNG is lossless, so it stays crisp — but a photographic PNG can be several times larger than the same image as JPG or WebP.",
      "The Image Compressor on this site runs entirely in your browser with a quality slider from 30% to 95%. It also caps very large images at 4,000 pixels on the longest side, which is more than enough for the web.",
      "After compressing, the tool shows how much you saved compared with the original. A large saving with no visible difference at 100% zoom is a good result; if the saving is tiny, the file was probably already compressed.",
      "Compress one file at a time, from the original each time. The tool takes a single JPG, PNG or WebP up to 20 MB, and nothing is uploaded — the work happens on your device."
    ]
  },
  {
    slug: "youtube-title-writing-practices",
    title: "Best YouTube Title Writing Practices",
    description: "What makes a title get clicked — and what makes viewers feel misled. Specificity, front-loaded keywords and honest promises.",
    tool: "youtube-title-generator",
    date: "2026-11-05",
    body: [
      "Put the most important words first. On phones, titles are cut off after about 60 characters, so the topic and the benefit belong at the start, not the end.",
      "Be specific instead of vague. 'How I Edit Videos' tells a viewer nothing; 'How I Edit a 10-Minute Video in 45 Minutes' tells them the topic, the format and the payoff.",
      "Promise only what the video delivers. A title that overpromises earns a click and loses a viewer within seconds — and YouTube notices when people leave early.",
      "Use numbers and brackets sparingly. A number ('7 mistakes') sets an expectation; a bracket ('[2026]') signals freshness. Used on every video, both stop working.",
      "Write the title for a human first and search second. Include the main keyword naturally, but if the title reads like a keyword list, people will skip it.",
      "Test two versions. Publish one title, and if click-through rate is low after a few thousand impressions, try a clearer or more specific version. Change one thing at a time so you know what helped.",
      "Write ten titles before you pick one. The YouTube Title Generator on this site produces four styles — how-to, list, curiosity and question — so you can compare a clear version against a curious one instead of guessing.",
      "A curiosity gap works only when the video closes it. 'The mistake that cost me $1,000' is honest if the video names the mistake; it is clickbait if the video never does. Viewers remember which one it was.",
      "The title and the thumbnail are one unit. Let the thumbnail carry the emotion or the face, and let the title carry the information. If both say the same words, one of them is wasted.",
      "Avoid all-caps titles and strings of exclamation marks. They read as shouting, they are harder to scan on a phone, and they do not make the title more clickable — they make it easier to ignore.",
      "Old videos can get new titles too. If a video has steady search traffic but a low click-through rate, a clearer title is the cheapest fix available — no re-edit, no re-upload, just a better promise."
    ]
  },
  {
    slug: "how-to-calculate-youtube-earnings",
    title: "How to Calculate YouTube Earnings",
    description: "RPM, CPM and the YouTube revenue share explained — plus why two channels with the same views can earn very different amounts.",
    tool: "youtube-earnings-calculator",
    date: "2026-11-05",
    body: [
      "The basic formula is simple: estimated earnings = (views / 1,000) x RPM. RPM — revenue per mille — is what a creator actually earns per 1,000 views after YouTube takes its share.",
      "CPM is different: it is what advertisers pay per 1,000 ad impressions, before YouTube's cut. RPM is the number that matters to a creator, and it is almost always lower than CPM.",
      "RPM varies enormously. Finance and business audiences in the US or UK can see RPMs of $10 or more; entertainment audiences in other regions may see $1 or less. The same video can earn five times more from one country's viewers than another's.",
      "Season matters too. Advertisers spend more in November and December, so RPMs usually rise before the holidays and fall in January. A yearly average is more honest than a single good month.",
      "Watch time helps indirectly: longer viewing sessions mean more ads can be shown, which usually raises revenue. But views alone do not determine earnings — a million views from a low-RPM audience can earn less than 100,000 views from a high-RPM one.",
      "Use the YouTube Earnings Calculator on this site to try a range of RPMs ($1, $3, $8) instead of a single number. A range is the honest answer; any calculator that gives one exact figure is pretending to know more than it does.",
      "A worked example from the calculator's own defaults: 100,000 monthly views at a $3 RPM gives an estimated $300 a month, or $3,600 a year at the same monthly views. Change the RPM to $1 and the same views give $100; at $8 they give $800. That spread is the point — the RPM matters more than the view count.",
      "YouTube keeps a share of ad revenue: creators receive 55% of the advertising revenue from their videos. RPM already accounts for that cut, which is why it is the right number to use in the formula.",
      "Shorts pay differently. Short-form views are pooled and paid at a much lower rate per view than long-form, so a million Shorts views do not earn like a million long-form views. Compare them separately.",
      "Videos over eight minutes can carry mid-roll ads, which is one reason longer videos often earn more per view. The extra ads only help if viewers keep watching, though — a long video people abandon earns less than a short one they finish.",
      "Treat any earnings figure as a range, not a promise. The calculator shows monthly and yearly estimates for the RPM you enter, and trying $1, $3 and $8 side by side is more honest than trusting a single number."
    ]
  },
  {
    slug: "instagram-bio-writing-examples",
    title: "Instagram Bio Writing Examples",
    description: "How to write a 150-character bio that says who you are, who it is for, and what to do next — with examples for creators, shops and coaches.",
    tool: "instagram-bio-generator",
    date: "2026-11-05",
    body: [
      "A good bio answers three questions in 150 characters: who are you, who is this for, and what should the visitor do next. If it only answers one, it is wasting space.",
      "Start with the benefit, not the job title. 'Helping busy parents cook in 20 minutes' is clearer than 'Food blogger | Mum of two'. The second line can carry the credentials.",
      "Use line breaks to make the bio scannable. One idea per line reads far better on a phone than a single dense paragraph.",
      "One call to action is enough. 'DM START for the free guide' beats three competing links and instructions. If you use a link-in-bio page, point to it once.",
      "Examples: a photographer — 'Portraits that feel like you | Lahore + worldwide | Bookings open for Dec'; a bakery — 'Fresh sourdough every morning | Order by 6pm for tomorrow | Multan'; a coach — 'Strength for people over 40 | No gym needed | Free starter plan below'.",
      "Update the bio when your offer changes. A bio advertising a finished launch or an old city confuses new visitors. Check it once a month.",
      "The Instagram Bio Generator on this site asks for two things — your name or handle and your niche — and drafts bios around them. Give it the words your audience actually searches for, not internal jargon.",
      "Put searchable words in the name line, not just your name. Instagram search reads the name field, so 'Ayesha — Home Baker, Multan' can be found by people searching for a baker, while 'Ayesha' alone cannot.",
      "Use emojis sparingly. One or two can mark the lines and add personality; a row of them slows reading, and screen readers read each emoji's name aloud, which makes a long emoji string tedious to listen to.",
      "More examples: a tutor — 'Maths made simple | Matric to FSc | Free first lesson, DM MATH'; a handmade-goods shop — 'Handmade candles, poured in Lahore | Ships across Pakistan | New scents every month'. Each one answers who, for whom, and what next.",
      "If you sell, say how to buy. 'Order via the link below' is clearer than 'Link in bio' repeated three times, and it tells a new visitor the next step without making them guess."
    ]
  },
  {
    slug: "how-to-calculate-instagram-engagement",
    title: "How to Calculate Instagram Engagement",
    description: "The engagement-rate formula, what counts as good, and why follower count alone tells you almost nothing.",
    tool: "instagram-engagement-calculator",
    date: "2026-11-05",
    body: [
      "The standard formula is: engagement rate = ((likes + comments + saves) / followers) x 100. Some versions also add shares, which is sensible — a share is a stronger signal than a like.",
      "Use a recent average, not one viral post. Add up the last 10–12 posts, average the interactions, and divide by followers. One outlier will mislead you.",
      "What counts as good depends on size. Accounts under 10,000 followers often see 3–6%; accounts over a million often see 1–2%. Comparing a small account to a celebrity account is meaningless.",
      "Engagement rate by reach is also useful: interactions divided by reach, not followers. It answers a different question — of the people who actually saw the post, how many cared? Both numbers are worth tracking.",
      "Do not buy engagement. Fake likes and comments inflate the numerator for a day and damage reach afterwards, because Instagram can tell the interactions are not real.",
      "If your rate is falling, the usual causes are posting at the wrong time, repeating a format your audience is tired of, or growing followers who never see your posts. The Instagram Engagement Calculator on this site does the arithmetic; the diagnosis is yours.",
      "A worked example from the calculator's own defaults: 1,200 likes, 80 comments and 150 saves from 20,000 followers gives (1,430 / 20,000) x 100 = 7.15%. The calculator calls anything above 3% strong, so these defaults are a strong result — most real accounts sit lower.",
      "Saves and shares count for more than likes. A like takes a second; a save means someone wants the post again, and a share means they vouched for it to someone else. The calculator includes saves in the formula for that reason.",
      "Engagement by reach is the fairer comparison for small accounts. If 500 people saw a post and 50 interacted, that is 10% of viewers — a much better sign than the same 50 interactions divided by 20,000 followers who never saw it.",
      "Replying to comments in the first hour helps twice: it adds interactions, and it signals to Instagram that the post is generating conversation. A short genuine reply beats a generic emoji.",
      "Do not compare across niches. A meme page and a B2B software account have different audiences and different normal rates; the useful comparison is your own account against its own past month."
    ]
  },
  {
    slug: "how-to-resize-images-for-social-media",
    title: "How to Resize Images for Social Media",
    description: "The right pixel sizes for YouTube, Instagram and TikTok, and how to resize without stretching or blurring.",
    tool: "image-resizer",
    date: "2026-11-05",
    body: [
      "Every platform crops differently, so start from the platform's recommended size: YouTube thumbnails 1280 x 720, Instagram square 1080 x 1080, Instagram portrait 1080 x 1350, Stories/Reels/TikTok 1080 x 1920.",
      "Never stretch an image to fit. If the ratio is wrong, either crop the edges or add padding (letterboxing). Stretching is visible immediately and makes everything look amateur.",
      "Resize from the original, not from a small copy. Enlarging a 500-pixel image to 1080 pixels cannot invent detail — it just makes the blur bigger.",
      "Keep the important subject in the safe centre. Instagram and TikTok both cover the top and bottom edges with buttons and captions, so faces and text near the edges can be hidden.",
      "Export at the size you will publish, then compress. Resizing first and compressing second gives the smallest file at the best quality — the opposite order wastes bytes.",
      "The Image Resizer on this site offers maintain-aspect-ratio, fit and crop modes, and the YouTube Thumbnail Resizer outputs exactly 1280 x 720. Both run in your browser, so your photos are never uploaded.",
      "The Image Resizer on this site has three modes: fit (whole image, padded to the target size), crop (fill the target size, trim the edges) and stretch (exact size, may distort). Fit is the safe default; crop suits photos where the edges are expendable.",
      "Keep 'Maintain aspect ratio' switched on unless you have a reason not to. With it on, changing the width updates the height automatically, so the image can never be squashed by accident.",
      "Instagram's own sizes, from the Post Size Calculator on this site: square 1080 x 1080, portrait 1080 x 1350, landscape 1080 x 566, Story and Reel 1080 x 1920, and profile picture 320 x 320 (shown as a circle, so keep faces centred).",
      "DPI does not matter for screens. A 1080-pixel image is 1080 pixels whether it says 72 DPI or 300 DPI — DPI only matters for printing. For social media, pixel dimensions are the only number that counts.",
      "If you resize for YouTube, use the dedicated Thumbnail Resizer instead: it outputs exactly 1280 x 720 in either cover mode (fill the frame, crop edges) or contain mode (whole image, letterboxed)."
    ]
  },
  {
    slug: "word-count-and-character-count-explained",
    title: "Word Count and Character Count Explained",
    description: "Words vs characters, with and without spaces, reading time, and the limits that actually matter for essays, posts and bios.",
    tool: "word-counter",
    date: "2026-11-05",
    body: [
      "Words are separated by spaces; characters include every letter, space and punctuation mark. A 100-word paragraph is typically 550–650 characters including spaces.",
      "Character counts come in two versions: with spaces and without. Social platforms count with spaces. Always check which one a limit uses — a bio limit of 150 characters means 150 including spaces.",
      "Reading time is usually estimated at 200–250 words per minute for an average adult. A 500-word page takes about two minutes; a 1,000-word article takes four to five.",
      "Common limits worth knowing: Instagram bio 150 characters, X post 280 characters, TikTok caption 2,200 characters, YouTube title 100 characters (but only ~60 show on mobile), meta descriptions about 155–160 characters in search results.",
      "Numbers count as words in most counters, and hyphenated words usually count as one. Different tools disagree on edge cases, so for an exam or assignment, use the same counting method the institution specifies.",
      "The Word Counter on this site shows words, characters with and without spaces, sentences, paragraphs and reading time live as you type — and your text never leaves your browser.",
      "Speaking is slower than reading. A script read aloud runs at roughly 130–150 words a minute, so a 300-word script is about two minutes of talking, and a 1,500-word talk is around ten minutes. Use the counter's reading time as a starting point, then time yourself.",
      "Why do two counters disagree? Usually hyphens, numbers, and em-dashes. Some counters treat a hyphenated word as one word, others as two; some count a standalone number as a word, others do not. For an exam or assignment, use the counting method the institution specifies — the counter cannot know it.",
      "Character limits are the ones that bite. A YouTube title allows 100 characters but only about 60 show on a phone; a TikTok caption allows 2,200; an X post 280. When a limit is in characters, always count with spaces, because that is what the platform counts.",
      "Paragraphs and sentences matter for readability, not just length. The Word Counter shows both: short paragraphs and varied sentence lengths read better than one long block, even at the same word count.",
      "For SEO, meta descriptions are usually shown at about 155–160 characters in search results. Longer descriptions get cut off, so the important words belong in the first 150 characters — the same front-loading rule as video titles."
    ]
  }
];
export const getArticle = (slug) => ARTICLES.find((a) => a.slug === slug);
