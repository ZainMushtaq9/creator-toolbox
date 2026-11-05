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
      "A common mistake is compressing the same file twice. Each JPG save loses a little more quality, so always compress from the original, not from an already-compressed copy."
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
      "Test two versions. Publish one title, and if click-through rate is low after a few thousand impressions, try a clearer or more specific version. Change one thing at a time so you know what helped."
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
      "Use the YouTube Earnings Calculator on this site to try a range of RPMs ($1, $3, $8) instead of a single number. A range is the honest answer; any calculator that gives one exact figure is pretending to know more than it does."
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
      "Update the bio when your offer changes. A bio advertising a finished launch or an old city confuses new visitors. Check it once a month."
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
      "If your rate is falling, the usual causes are posting at the wrong time, repeating a format your audience is tired of, or growing followers who never see your posts. The Instagram Engagement Calculator on this site does the arithmetic; the diagnosis is yours."
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
      "The Image Resizer on this site offers maintain-aspect-ratio, fit and crop modes, and the YouTube Thumbnail Resizer outputs exactly 1280 x 720. Both run in your browser, so your photos are never uploaded."
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
      "The Word Counter on this site shows words, characters with and without spaces, sentences, paragraphs and reading time live as you type — and your text never leaves your browser."
    ]
  }
];
export const getArticle = (slug) => ARTICLES.find((a) => a.slug === slug);
