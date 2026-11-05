// SINGLE SOURCE OF TRUTH for all tools, categories, slugs, SEO metadata,
// FAQs and related tools. Routes, sitemap, navigation and internal links
// are all generated from this registry — do NOT hardcode tool lists elsewhere.
export const CATEGORIES = [
  { slug: "youtube-tools", path: "/youtube-tools", name: "YouTube Tools", icon: "Youtube", description: "Titles, descriptions, hashtags, tags, thumbnails and earnings estimates for YouTube creators." },
  { slug: "instagram-tools", path: "/instagram-tools", name: "Instagram Tools", icon: "Instagram", description: "Captions, hashtags, bios and calculators for Instagram posts and profiles." },
  { slug: "tiktok-tools", path: "/tiktok-tools", name: "TikTok Tools", icon: "Music2", description: "Hooks, captions and hashtags for TikTok videos." },
  { slug: "image-tools", path: "/image-tools", name: "Image Tools", icon: "Image", description: "Compress, resize and convert images right in your browser — no upload needed." },
  { slug: "text-tools", path: "/text-tools", name: "Text Tools", icon: "Type", description: "Count words and characters, and convert text case in seconds." }
];

export const TOOLS = [
  {
    slug: "youtube-title-generator", name: "YouTube Title Generator", category: "youtube-tools",
    title: "Free YouTube Title Generator Online",
    description: "Generate catchy YouTube video titles from your topic using proven templates. Free, instant, and no sign-up.",
    keywords: "youtube title generator, video title ideas, catchy youtube titles",
    howTo: ["Enter your video topic or main keyword.", "Pick a style (how-to, list, curiosity or question).", "Click Generate Titles.", "Copy your favourite title and tweak it to fit your video."],
    formats: "Text output. Copy any title to your clipboard. No file upload.",
    examples: ["Topic: budget travel in Pakistan → “7 Budget Travel Mistakes in Pakistan (I Learned the Hard Way)”", "Topic: sourdough for beginners → “Sourdough for Beginners: Your First Loaf in 5 Simple Steps”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. This generator uses hand-written templates, not AI. That keeps it free, instant and private — your topic never leaves your browser." },
      { q: "Will these titles guarantee more views?", a: "No title can guarantee views. A good title helps people click, but the video itself has to deliver on the promise." },
      { q: "Is the tool free?", a: "Yes, completely free with no sign-up." },
      { q: "Is my topic uploaded to a server?", a: "No. Title generation runs locally in your browser." }
    ],
    related: ["youtube-description-generator", "youtube-hashtag-generator", "youtube-tag-generator", "youtube-shorts-title-generator"]
  },
  {
    slug: "youtube-description-generator", name: "YouTube Description Generator", category: "youtube-tools",
    title: "Free YouTube Description Generator Online",
    description: "Create a structured YouTube video description with a hook, summary, timestamps placeholder and call to action.",
    keywords: "youtube description generator, video description template",
    howTo: ["Enter your video title and topic.", "Add 2–3 key points your video covers.", "Click Generate Description.", "Copy it into YouTube Studio and adjust the links."],
    formats: "Text output, ready to paste into YouTube Studio.",
    examples: ["A how-to video description with a clear first line, because YouTube shows only the first 1–2 lines in search.", "A vlog description with timestamps and social links placeholders."],
    faqs: [
      { q: "Does this tool use AI?", a: "No. It uses templates, not AI. Your input stays in your browser." },
      { q: "What should the first line of a description say?", a: "Put the most important words first — the topic and the benefit — because only the first lines show in search results." },
      { q: "Can I add my own links?", a: "Yes. The template leaves placeholders for links; replace them with your own before publishing." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["youtube-title-generator", "youtube-hashtag-generator", "youtube-tag-generator", "word-counter"]
  },
  {
    slug: "youtube-hashtag-generator", name: "YouTube Hashtag Generator", category: "youtube-tools",
    title: "Free YouTube Hashtag Generator Online",
    description: "Generate relevant YouTube hashtags from your topic so viewers can discover your video.",
    keywords: "youtube hashtag generator, youtube hashtags, video hashtags",
    howTo: ["Enter your video topic.", "Click Generate Hashtags.", "Copy the hashtags and paste them into your description or title area."],
    formats: "Text output. Use up to 15 hashtags per video; YouTube ignores extras beyond that.",
    examples: ["Topic: home workout → #HomeWorkout #FitnessAtHome #NoEquipmentWorkout", "Topic: street food → #StreetFood #FoodVlog #Foodie"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Hashtags are matched from keyword templates, not AI." },
      { q: "How many hashtags should I use?", a: "YouTube allows up to 15; using 3–8 relevant ones is usually enough. Irrelevant hashtags do not help." },
      { q: "Do hashtags guarantee discovery?", a: "No. They help categorise a video, but titles, thumbnails and watch time matter far more." },
      { q: "Is my topic uploaded anywhere?", a: "No, everything runs locally in your browser." }
    ],
    related: ["youtube-tag-generator", "youtube-title-generator", "instagram-hashtag-generator", "tiktok-hashtag-generator"]
  },
  {
    slug: "youtube-tag-generator", name: "YouTube Tag Generator", category: "youtube-tools",
    title: "Free YouTube Tag Generator Online",
    description: "Generate keyword tag suggestions for your YouTube video, including broad, specific and long-tail variations.",
    keywords: "youtube tag generator, youtube tags, video tags",
    howTo: ["Enter your main keyword or topic.", "Click Generate Tags.", "Copy the comma-separated tags into YouTube Studio."],
    formats: "Comma-separated text output.",
    examples: ["Keyword: drone photography → drone photography, drone shots, aerial photography tips", "Keyword: learn guitar → learn guitar, guitar for beginners, guitar lessons"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Tags are generated from keyword templates in your browser." },
      { q: "Do tags still matter on YouTube?", a: "They play a small role, mainly when viewers misspell a topic. Titles, descriptions and content matter much more." },
      { q: "How many tags should I add?", a: "A focused set of 10–20 relevant tags is enough. Stuffing hundreds of tags does not help." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["youtube-hashtag-generator", "youtube-title-generator", "youtube-description-generator", "word-counter"]
  },
  {
    slug: "youtube-thumbnail-resizer", name: "YouTube Thumbnail Resizer", category: "youtube-tools",
    title: "Free YouTube Thumbnail Resizer (1280 × 720)",
    description: "Resize any image to exactly 1280 × 720 pixels for a YouTube thumbnail — processed locally in your browser, nothing is uploaded.",
    keywords: "youtube thumbnail resizer, 1280x720 thumbnail, resize thumbnail",
    howTo: ["Upload an image (JPG, PNG or WebP).", "Choose fit (cover) or contain (letterboxed).", "Click Resize Thumbnail.", "Download the 1280 × 720 image."],
    formats: "Input: JPG, PNG, WebP. Output: JPG or PNG at exactly 1280 × 720 px. File size limit: 20 MB.",
    examples: ["A phone photo resized to a crisp 1280 × 720 thumbnail.", "A wide screenshot fitted to thumbnail size without stretching."],
    faqs: [
      { q: "Is my image uploaded to a server?", a: "No. Resizing happens locally with the Canvas API. Your image never leaves your device." },
      { q: "What size does YouTube recommend?", a: "1280 × 720 pixels (16:9). This tool outputs exactly that size." },
      { q: "Will the image be stretched?", a: "No. Cover mode crops the edges to fill the frame; contain mode keeps the whole image with padding." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["image-resizer", "image-compressor", "video-aspect-ratio-calculator", "jpg-to-png-converter"]
  },
  {
    slug: "video-aspect-ratio-calculator", name: "Video Aspect Ratio Calculator", category: "youtube-tools",
    title: "Free Video Aspect Ratio Calculator Online",
    description: "Calculate aspect ratios (16:9, 9:16, 1:1, 4:5) and the matching width or height for any video or image size.",
    keywords: "aspect ratio calculator, video aspect ratio, 16:9 calculator",
    howTo: ["Enter a width and height, or pick a preset ratio.", "Enter one known side.", "The calculator works out the other side and the simplified ratio."],
    formats: "Numbers only. No files involved.",
    examples: ["1920 × 1080 → 16:9 widescreen (YouTube, desktop video).", "1080 × 1920 → 9:16 vertical (Shorts, Reels, TikTok).", "1080 × 1080 → 1:1 square feed post."],
    faqs: [
      { q: "What is an aspect ratio?", a: "It is the proportional relationship between width and height — for example 16:9 means 16 units wide for every 9 units tall." },
      { q: "Which ratio should I use for YouTube Shorts?", a: "9:16 vertical (1080 × 1920). For standard YouTube videos use 16:9 (1920 × 1080)." },
      { q: "Does the calculator upload anything?", a: "No. It is a plain calculation in your browser." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["youtube-thumbnail-resizer", "instagram-post-size-calculator", "image-resizer", "youtube-earnings-calculator"]
  },
  {
    slug: "youtube-earnings-calculator", name: "YouTube Earnings Calculator", category: "youtube-tools",
    title: "Free YouTube Earnings Calculator (RPM Estimate)",
    description: "Estimate YouTube earnings from views and RPM. This is an estimate only — actual revenue depends on audience, niche, season and ads.",
    keywords: "youtube earnings calculator, youtube money calculator, youtube rpm calculator",
    howTo: ["Enter your monthly views.", "Enter an RPM (revenue per 1,000 views) — try $1, $3 and $8 to see the range.", "Read the estimated monthly and yearly earnings."],
    formats: "Numbers only. Formula: estimated earnings = (views ÷ 1,000) × RPM.",
    examples: ["100,000 views at $3 RPM → about $300.", "1,000,000 views at $5 RPM → about $5,000. Both are estimates, not guarantees."],
    faqs: [
      { q: "Is this an exact earnings figure?", a: "No. It is an estimate. Real RPM varies by country, niche, advertiser demand and season, and YouTube takes a share." },
      { q: "What is RPM?", a: "Revenue per mille — the money a creator earns per 1,000 views after YouTube's share, roughly $1–$10 for most channels." },
      { q: "Does watch time or subscribers change the result?", a: "Yes, indirectly. Higher watch time and a valuable audience usually raise RPM, but this calculator only uses views and RPM." },
      { q: "Is my data stored?", a: "No. The calculation runs locally in your browser." }
    ],
    related: ["video-aspect-ratio-calculator", "youtube-title-generator", "instagram-engagement-calculator", "youtube-shorts-title-generator"]
  },
  {
    slug: "youtube-shorts-title-generator", name: "YouTube Shorts Title Generator", category: "youtube-tools",
    title: "Free YouTube Shorts Title Generator Online",
    description: "Generate short, punchy titles for YouTube Shorts — under 60 characters where possible, built for vertical scrolling.",
    keywords: "youtube shorts title generator, shorts title ideas",
    howTo: ["Enter your Shorts topic.", "Pick a style (hook, how-to or curiosity).", "Click Generate Titles.", "Copy a title under 60 characters if you can."],
    formats: "Text output. Titles aim for under 60 characters so they are not cut off on mobile.",
    examples: ["Topic: 30-second pasta → “30-Second Pasta? Yes, Really.”", "Topic: morning routine → “My 5-Minute Morning Routine”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. It uses templates, not AI, and runs entirely in your browser." },
      { q: "How long should a Shorts title be?", a: "Short — ideally under 60 characters — so it is fully visible on a phone screen." },
      { q: "Can I use these titles for TikTok or Reels too?", a: "Yes, the same short hook-style titles work on other short-video platforms." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["youtube-title-generator", "tiktok-hook-generator", "tiktok-caption-generator", "youtube-hashtag-generator"]
  },
  {
    slug: "instagram-caption-generator", name: "Instagram Caption Generator", category: "instagram-tools",
    title: "Free Instagram Caption Generator Online",
    description: "Generate Instagram captions from your topic and mood — short, funny, aesthetic or motivational — using templates, not AI.",
    keywords: "instagram caption generator, instagram captions, caption ideas",
    howTo: ["Enter your post topic.", "Pick a mood (aesthetic, funny, motivational or minimal).", "Click Generate Captions.", "Copy your favourite and add your own hashtags."],
    formats: "Text output. Captions are short enough for Instagram posts and Reels.",
    examples: ["Topic: golden hour photo, aesthetic mood → “Chasing light, collecting moments.”", "Topic: gym progress, motivational mood → “Small steps. Every single day.”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Captions come from templates. Your topic never leaves your browser." },
      { q: "How long should an Instagram caption be?", a: "Short captions (under 125 characters) show fully in the feed; longer storytelling captions work when the photo needs context." },
      { q: "Are emojis included?", a: "Some templates include emojis. Remove or change any that do not fit your style." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["instagram-hashtag-generator", "instagram-bio-generator", "tiktok-caption-generator", "instagram-engagement-calculator"]
  },
  {
    slug: "instagram-hashtag-generator", name: "Instagram Hashtag Generator", category: "instagram-tools",
    title: "Free Instagram Hashtag Generator Online",
    description: "Generate relevant Instagram hashtags from your topic, mixing popular and niche tags so your post can be discovered.",
    keywords: "instagram hashtag generator, instagram hashtags",
    howTo: ["Enter your post topic.", "Click Generate Hashtags.", "Copy 5–15 hashtags and paste them in your caption or first comment."],
    formats: "Text output. Instagram allows up to 30 hashtags per post; 5–15 relevant ones is a sensible range.",
    examples: ["Topic: travel photography → #TravelPhotography #Wanderlust #PhotoOfTheDay", "Topic: home baking → #HomeBaker #BakingLove #FreshBread"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Hashtags are matched from keyword templates in your browser." },
      { q: "How many hashtags should I use?", a: "Instagram allows 30, but 5–15 relevant ones usually works better than 30 random ones." },
      { q: "Do hashtags guarantee reach?", a: "No. They help discovery, but the photo, caption and engagement matter more." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["instagram-caption-generator", "youtube-hashtag-generator", "tiktok-hashtag-generator", "instagram-bio-generator"]
  },
  {
    slug: "instagram-bio-generator", name: "Instagram Bio Generator", category: "instagram-tools",
    title: "Free Instagram Bio Generator Online",
    description: "Generate a short Instagram bio from your name, niche and vibe — under 150 characters, ready to paste into your profile.",
    keywords: "instagram bio generator, instagram bio ideas",
    howTo: ["Enter your name or handle and your niche.", "Pick a vibe (clean, creative or professional).", "Click Generate Bios.", "Copy one under 150 characters into your profile."],
    formats: "Text output. Instagram bios are limited to 150 characters.",
    examples: ["Niche: food blogger → “Tasting my way through the city, one plate at a time.”", "Niche: fitness coach → “Helping busy people get strong | Coach | DM ‘START’”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Bios are built from templates in your browser." },
      { q: "How long can an Instagram bio be?", a: "150 characters. This generator aims to stay under that limit." },
      { q: "Can I add emojis and line breaks?", a: "Yes — edit the generated bio to add emojis or line breaks before pasting it in." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["instagram-caption-generator", "instagram-hashtag-generator", "instagram-engagement-calculator", "word-counter"]
  },
  {
    slug: "instagram-post-size-calculator", name: "Instagram Post Size Calculator", category: "instagram-tools",
    title: "Free Instagram Post Size Calculator Online",
    description: "Find the right pixel size for Instagram posts, Reels, Stories and profile pictures — square, portrait, landscape and vertical.",
    keywords: "instagram post size, instagram dimensions, instagram image size",
    howTo: ["Pick a format (feed square, portrait, landscape, Story/Reel or profile picture).", "Read the recommended pixel size and ratio.", "Resize your image to match before uploading."],
    formats: "Reference sizes: square 1080 × 1080 (1:1), portrait 1080 × 1350 (4:5), landscape 1080 × 566 (1.91:1), Story/Reel 1080 × 1920 (9:16).",
    examples: ["Feed square post → 1080 × 1080.", "Story or Reel → 1080 × 1920 vertical.", "Portrait feed post → 1080 × 1350 (4:5) — the tallest a feed photo can be."],
    faqs: [
      { q: "What size should an Instagram feed photo be?", a: "1080 × 1080 for square, or 1080 × 1350 for portrait (4:5), which uses more screen space." },
      { q: "What size are Instagram Stories?", a: "1080 × 1920 pixels (9:16 vertical). Keep important text away from the top and bottom edges." },
      { q: "Does Instagram compress my photos?", a: "Yes, Instagram compresses uploads, so starting from the recommended size gives the best result." },
      { q: "Is this calculator free?", a: "Yes, free with no sign-up." }
    ],
    related: ["image-resizer", "video-aspect-ratio-calculator", "youtube-thumbnail-resizer", "instagram-engagement-calculator"]
  },
  {
    slug: "instagram-engagement-calculator", name: "Instagram Engagement Calculator", category: "instagram-tools",
    title: "Free Instagram Engagement Calculator Online",
    description: "Calculate your Instagram engagement rate from likes, comments, saves and followers. Formula shown, no data stored.",
    keywords: "instagram engagement calculator, engagement rate calculator",
    howTo: ["Enter likes, comments and saves for a post (or averages).", "Enter your follower count.", "Read the engagement rate."],
    formats: "Numbers only. Formula: engagement rate = ((likes + comments + saves) ÷ followers) × 100.",
    examples: ["1,200 likes + 80 comments on 20,000 followers → about 6.4% engagement.", "A rate of 1–3% is typical; above 3% is strong for most accounts."],
    faqs: [
      { q: "What is a good Instagram engagement rate?", a: "Roughly 1–3% is typical. Smaller accounts often see higher rates; very large accounts often see lower ones." },
      { q: "Should I include saves and shares?", a: "Yes — saves and shares are strong signals. This calculator includes saves; add shares to the comments field if you want them counted." },
      { q: "Is my account data stored?", a: "No. The calculation runs locally in your browser." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["instagram-caption-generator", "instagram-post-size-calculator", "youtube-earnings-calculator", "instagram-bio-generator"]
  },
  {
    slug: "tiktok-hook-generator", name: "TikTok Hook Generator", category: "tiktok-tools",
    title: "Free TikTok Hook Generator Online",
    description: "Generate scroll-stopping opening lines for TikTok videos — the first 3 seconds decide whether viewers stay.",
    keywords: "tiktok hook generator, tiktok hooks, video hook ideas",
    howTo: ["Enter your video topic.", "Pick a hook style (curiosity, bold claim or mistake).", "Click Generate Hooks.", "Say the hook in the first 3 seconds of your video."],
    formats: "Text output. Hooks are one short spoken line.",
    examples: ["Topic: budgeting → “Stop doing this with your salary.”", "Topic: skincare → “I tried this for 30 days — here is what happened.”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Hooks are built from templates in your browser." },
      { q: "Why do hooks matter on TikTok?", a: "Viewers decide in about 3 seconds whether to keep watching. A clear hook earns those seconds." },
      { q: "Should the hook match the video?", a: "Yes — a hook that overpromises and under-delivers hurts watch time and trust." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["tiktok-caption-generator", "youtube-shorts-title-generator", "tiktok-hashtag-generator", "youtube-title-generator"]
  },
  {
    slug: "tiktok-caption-generator", name: "TikTok Caption Generator", category: "tiktok-tools",
    title: "Free TikTok Caption Generator Online",
    description: "Generate short TikTok captions from your topic — conversational, punchy and under the 2,200-character limit.",
    keywords: "tiktok caption generator, tiktok captions",
    howTo: ["Enter your video topic.", "Pick a tone (funny, casual or informative).", "Click Generate Captions.", "Copy one and add 3–5 hashtags."],
    formats: "Text output. TikTok captions can be up to 2,200 characters, but short captions usually perform better.",
    examples: ["Topic: morning coffee → “POV: the first sip hits different.”", "Topic: study tips → “Study smarter, not longer. Save this.”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Captions are generated from templates in your browser." },
      { q: "How long should a TikTok caption be?", a: "Short — one or two lines plus hashtags. Most viewers read the video, not a long caption." },
      { q: "Can I use these on Reels or Shorts too?", a: "Yes, short casual captions transfer well across short-video platforms." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["tiktok-hook-generator", "tiktok-hashtag-generator", "instagram-caption-generator", "youtube-shorts-title-generator"]
  },
  {
    slug: "tiktok-hashtag-generator", name: "TikTok Hashtag Generator", category: "tiktok-tools",
    title: "Free TikTok Hashtag Generator Online",
    description: "Generate relevant TikTok hashtags from your topic, mixing broad discovery tags with niche ones.",
    keywords: "tiktok hashtag generator, tiktok hashtags",
    howTo: ["Enter your video topic.", "Click Generate Hashtags.", "Copy 3–5 hashtags into your caption."],
    formats: "Text output. 3–5 relevant hashtags per video is a good starting point.",
    examples: ["Topic: easy recipes → #EasyRecipes #FoodTok #QuickMeals", "Topic: thrift finds → #ThriftFinds #ThriftHaul #SustainableFashion"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Hashtags are matched from keyword templates in your browser." },
      { q: "How many hashtags should I use on TikTok?", a: "3–5 relevant hashtags is enough. More tags do not mean more reach." },
      { q: "Do hashtags guarantee going viral?", a: "No. They help TikTok understand the video, but watch time and shares matter far more." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["tiktok-hook-generator", "tiktok-caption-generator", "instagram-hashtag-generator", "youtube-hashtag-generator"]
  },
  {
    slug: "image-compressor", name: "Image Compressor", category: "image-tools",
    title: "Free Image Compressor Online (No Upload)",
    description: "Compress JPG, PNG and WebP images in your browser. Adjust quality and download smaller files — nothing is uploaded.",
    keywords: "image compressor, compress jpg, compress png, reduce image size",
    howTo: ["Upload an image (JPG, PNG or WebP, up to 20 MB).", "Choose a quality level.", "Click Compress Image.", "Download the compressed file and compare sizes."],
    formats: "Input: JPG, PNG, WebP. Output: same format where possible; PNG transparency is preserved when output is PNG/WebP. JPG has no transparency.",
    examples: ["A 4 MB phone photo compressed to under 800 KB at 80% quality.", "A PNG screenshot with transparency kept as PNG so the transparent areas survive."],
    faqs: [
      { q: "Is my image uploaded to a server?", a: "No. Compression runs entirely in your browser with a local library. Your image never leaves your device." },
      { q: "Does compression preserve transparency?", a: "Yes, when the output format supports it (PNG or WebP). JPG cannot store transparency, so transparent areas become a solid background." },
      { q: "How much smaller will my image get?", a: "It depends on the image. Photos often shrink 50–80% at 70–80% quality with little visible loss; simple graphics shrink less." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["image-resizer", "jpg-to-png-converter", "youtube-thumbnail-resizer", "instagram-post-size-calculator"]
  },
  {
    slug: "image-resizer", name: "Image Resizer", category: "image-tools",
    title: "Free Image Resizer Online (No Upload)",
    description: "Resize images to exact dimensions with maintain-aspect-ratio, fit or crop options — processed locally, nothing uploaded.",
    keywords: "image resizer, resize image online, resize photo",
    howTo: ["Upload an image (JPG, PNG or WebP).", "Enter a target width and/or height.", "Choose maintain aspect ratio, fit or crop.", "Download the resized image."],
    formats: "Input: JPG, PNG, WebP. Output: JPG or PNG. High-quality resize via the Pica library, loaded on demand.",
    examples: ["A 4000 × 3000 photo resized to 1200 × 900 for a blog.", "A square profile picture cropped to 500 × 500."],
    faqs: [
      { q: "Is my image uploaded to a server?", a: "No. Resizing happens locally in your browser." },
      { q: "What does maintain aspect ratio do?", a: "It locks the width-to-height proportion, so entering a width automatically sets the matching height and the image is never stretched." },
      { q: "Fit vs crop — what is the difference?", a: "Fit keeps the whole image inside the target size with padding; crop fills the target size and trims the edges." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["image-compressor", "jpg-to-png-converter", "youtube-thumbnail-resizer", "instagram-post-size-calculator"]
  },
  {
    slug: "jpg-to-png-converter", name: "JPG to PNG Converter", category: "image-tools",
    title: "Free JPG to PNG Converter Online (No Upload)",
    description: "Convert JPG images to PNG in your browser. No upload, no sign-up — your file never leaves your device.",
    keywords: "jpg to png converter, convert jpg to png",
    howTo: ["Upload a JPG image.", "Click Convert to PNG.", "Download the PNG file."],
    formats: "Input: JPG/JPEG. Output: PNG. Note: converting JPG to PNG does not restore quality lost in JPG compression, and PNG files are usually larger.",
    examples: ["A JPG photo converted to PNG for use in a design tool that needs PNG.", "A JPG logo converted to PNG before adding transparency in an editor."],
    faqs: [
      { q: "Is my image uploaded to a server?", a: "No. Conversion uses the Canvas API locally in your browser." },
      { q: "Will PNG look better than the JPG?", a: "No — conversion cannot add back detail lost when the JPG was compressed. PNG is lossless from this point on, but the starting quality stays the same." },
      { q: "Why is the PNG larger?", a: "PNG is a lossless format, so it stores more data than a compressed JPG. That is normal." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["image-compressor", "image-resizer", "youtube-thumbnail-resizer", "word-counter"]
  },
  {
    slug: "word-counter", name: "Word Counter", category: "text-tools",
    title: "Free Online Word Counter",
    description: "Count words, characters, sentences, paragraphs and reading time in any text — free, instant, and private.",
    keywords: "word counter, character counter, count words online",
    howTo: ["Paste or type your text in the box.", "Counts update live as you type.", "Use Copy or Reset to start again."],
    formats: "Plain text input. No file upload. Text is never sent to a server.",
    examples: ["A 500-word essay → about 2–3 minutes reading time.", "A tweet draft checked against character limits before posting."],
    faqs: [
      { q: "What is a word counter?", a: "A tool that counts the words, characters, sentences and paragraphs in a piece of text, and estimates how long it takes to read." },
      { q: "Does the word count include punctuation?", a: "Punctuation attached to a word does not create an extra word. Numbers count as words; standalone symbols usually do not." },
      { q: "What is the difference between words and characters?", a: "Words are separated by spaces; characters include every letter, space and punctuation mark. Character counts include spaces unless stated otherwise — this tool shows both." },
      { q: "Is my text uploaded to a server?", a: "No. Counting runs locally in your browser and your text is never stored or sent anywhere." },
      { q: "Is the tool free?", a: "Yes, completely free with no sign-up." }
    ],
    related: ["text-case-converter", "youtube-description-generator", "instagram-bio-generator", "instagram-caption-generator"]
  },
  {
    slug: "text-case-converter", name: "Text Case Converter", category: "text-tools",
    title: "Free Text Case Converter Online",
    description: "Convert text to UPPERCASE, lowercase, Title Case, Sentence case and more — free, instant, private.",
    keywords: "text case converter, uppercase lowercase converter, title case converter",
    howTo: ["Paste or type your text.", "Click a case button (UPPERCASE, lowercase, Title Case, Sentence case, aLtErNaTiNg).", "Copy the converted text."],
    formats: "Plain text input and output. No file upload.",
    examples: ["“hello world” → Title Case → “Hello World”.", "A SHOUTY HEADING → lowercase → “a shouty heading”."],
    faqs: [
      { q: "What cases are supported?", a: "UPPERCASE, lowercase, Title Case, Sentence case, Capitalized Words and aLtErNaTiNg case." },
      { q: "Is my text uploaded to a server?", a: "No. Conversion runs locally in your browser." },
      { q: "Does Title Case handle small words like “and” or “the”?", a: "This converter capitalises each word. For formal titles, check style-guide rules for small words before publishing." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["word-counter", "youtube-title-generator", "instagram-bio-generator", "youtube-description-generator"]
  }
];

export const getTool = (slug) => TOOLS.find((t) => t.slug === slug);
export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const toolsByCategory = (slug) => TOOLS.filter((t) => t.category === slug);
export const relatedTools = (tool) => (tool.related || []).map(getTool).filter(Boolean);

export const publicPages = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.9, changeFrequency: "weekly" },
  ...CATEGORIES.map((c) => ({ path: c.path, priority: 0.8, changeFrequency: "weekly" })),
  ...TOOLS.map((t) => ({ path: `/tools/${t.slug}`, priority: 0.9, changeFrequency: "monthly" })),
  { path: "/workflows", priority: 0.7, changeFrequency: "weekly" },
  { path: "/workflows/youtube-creator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/workspaces", priority: 0.6, changeFrequency: "monthly" },
  { path: "/collections", priority: 0.7, changeFrequency: "weekly" },
  { path: "/collections/youtube-starter-kit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/collections/instagram-growth-kit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/collections/blogger-seo-kit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/collections/website-launch-kit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/collections/developer-starter-kit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/collections/image-optimization-kit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/collections/student-productivity-kit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/collections/small-business-kit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/blog/compress-images-without-losing-quality", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/youtube-title-writing-practices", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/how-to-calculate-youtube-earnings", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/instagram-bio-writing-examples", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/how-to-calculate-instagram-engagement", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/how-to-resize-images-for-social-media", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/word-count-and-character-count-explained", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "monthly" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "monthly" },
  { path: "/cookie-policy", priority: 0.3, changeFrequency: "monthly" }
];
