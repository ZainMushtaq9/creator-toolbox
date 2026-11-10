// SINGLE SOURCE OF TRUTH for all tools, categories, slugs, SEO metadata,
// FAQs and related tools. Routes, sitemap, navigation and internal links
// are all generated from this registry — do NOT hardcode tool lists elsewhere.
export const CATEGORIES = [
  { slug: "youtube-tools", path: "/youtube-tools", name: "YouTube Tools", icon: "Youtube", description: "Titles, descriptions, hashtags, tags, thumbnails and earnings estimates for YouTube creators." },
  { slug: "instagram-tools", path: "/instagram-tools", name: "Instagram Tools", icon: "Instagram", description: "Captions, hashtags, bios and calculators for Instagram posts and profiles." },
  { slug: "tiktok-tools", path: "/tiktok-tools", name: "TikTok Tools", icon: "Music2", description: "Hooks, captions and hashtags for TikTok videos." },
  { slug: "image-tools", path: "/image-tools", name: "Image Tools", icon: "Image", description: "Compress, resize and convert images right in your browser — no upload needed." },
  { slug: "text-tools", path: "/text-tools", name: "Text Tools", icon: "Type", description: "Count words and characters, and convert text case in seconds." },
  { slug: "calculator-tools", path: "/calculator-tools", name: "Calculator Tools", icon: "Calculator", description: "Free everyday calculators — percentages, age, BMI, loan EMI and unit conversion — that run in your browser with the formula shown." }
];

export const TOOLS = [
  {
    slug: "youtube-title-generator", name: "YouTube Title Generator", category: "youtube-tools",
    title: "Free YouTube Title Generator Online",
    description: "Generate catchy YouTube video titles and title ideas from your topic using proven templates — how-to, list, curiosity or question. Free, instant, no sign-up.",
    keywords: "youtube title generator, video title ideas, catchy youtube titles, youtube video title generator, youtube title ideas",
    howTo: ["Enter your video topic or main keyword.", "Pick a style (how-to, list, curiosity or question).", "Click Generate Titles.", "Copy your favourite title and tweak it to fit your video."],
    formats: "Text output. Copy any title to your clipboard. No file upload.",
    examples: ["Topic: budget travel in Pakistan → “7 Budget Travel Mistakes in Pakistan (I Learned the Hard Way)”", "Topic: sourdough for beginners → “Sourdough for Beginners: Your First Loaf in 5 Simple Steps”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. This generator uses hand-written templates, not AI. That keeps it free, instant and private — your topic never leaves your browser." },
      { q: "Will these titles guarantee more views?", a: "No title can guarantee views. A good title helps people click, but the video itself has to deliver on the promise." },
      { q: "Is the tool free?", a: "Yes, completely free with no sign-up." },
      { q: "Is my topic uploaded to a server?", a: "No. Title generation runs locally in your browser." },
      { q: "What makes a good YouTube title?", a: "A good title is specific, puts the main keyword near the front, and promises one clear benefit. Aim for around 60–70 characters so it is not cut off in search results — YouTube allows 100 characters in the title field." },
      { q: "Where can I find video title ideas for my next video?", a: "Enter your topic here — this generator gives you video title ideas in four styles (how-to, list, curiosity or question) that you can copy and adapt to fit your video." },
      { q: "Is this a YouTube video title generator?", a: "Yes. It turns your topic into catchy YouTube titles and YouTube title ideas using hand-written templates — free, instant and private, with nothing uploaded to a server." }
    ],
    related: ["youtube-description-generator", "youtube-hashtag-generator", "youtube-tag-generator", "youtube-shorts-title-generator"]
  },
  {
    slug: "youtube-description-generator", name: "YouTube Description Generator", category: "youtube-tools",
    title: "Free YouTube Description Generator Online",
    description: "Create a structured YouTube video description from a template — hook, summary, timestamps and call to action. Paste it into YouTube Studio and adjust the links.",
    keywords: "youtube description generator, video description template, youtube description template, youtube video description",
    howTo: ["Enter your video title and topic.", "Add 2–3 key points your video covers.", "Click Generate Description.", "Copy it into YouTube Studio and adjust the links."],
    formats: "Text output, ready to paste into YouTube Studio.",
    examples: ["A how-to video description with a clear first line, because YouTube shows only the first 1–2 lines in search.", "A vlog description with timestamps and social links placeholders."],
    faqs: [
      { q: "Does this tool use AI?", a: "No. It uses templates, not AI. Your input stays in your browser." },
      { q: "What should the first line of a description say?", a: "Put the most important words first — the topic and the benefit — because only the first lines show in search results." },
      { q: "Can I add my own links?", a: "Yes. The template leaves placeholders for links; replace them with your own before publishing." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "How long can a YouTube description be?", a: "YouTube allows up to 5,000 characters. Only the first 1–2 lines (about 150 characters) show in search results, so put the topic and the benefit first." },
      { q: "Can I use this as a YouTube description template?", a: "Yes. This tool works as a YouTube description template and a video description template in one — it gives you a structured layout with a hook, summary, timestamps placeholder and call to action that you can reuse for every video." }
    ],
    related: ["youtube-title-generator", "youtube-hashtag-generator", "youtube-tag-generator", "word-counter"]
  },
  {
    slug: "youtube-hashtag-generator", name: "YouTube Hashtag Generator", category: "youtube-tools",
    title: "Free YouTube Hashtag Generator Online",
    description: "Generate relevant YouTube hashtags from your topic — ready to copy — so viewers can discover your video. Use up to 15 per video; YouTube ignores extras.",
    keywords: "youtube hashtag generator, youtube hashtags, video hashtags, hashtags for youtube shorts, youtube hashtags to copy and paste",
    howTo: ["Enter your video topic.", "Click Generate Hashtags.", "Copy the hashtags and paste them into your description or title area."],
    formats: "Text output. Use up to 15 hashtags per video; YouTube ignores extras beyond that.",
    examples: ["Topic: home workout → #HomeWorkout #FitnessAtHome #NoEquipmentWorkout", "Topic: street food → #StreetFood #FoodVlog #Foodie"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Hashtags are matched from keyword templates, not AI." },
      { q: "How many hashtags should I use?", a: "YouTube allows up to 15; using 3–8 relevant ones is usually enough. Irrelevant hashtags do not help." },
      { q: "Do hashtags guarantee discovery?", a: "No. They help categorise a video, but titles, thumbnails and watch time matter far more." },
      { q: "Is my topic uploaded anywhere?", a: "No, everything runs locally in your browser." },
      { q: "Can I use these hashtags for YouTube Shorts?", a: "Yes. The same hashtags work for Shorts — keep them short and relevant to the video, and put the most important one first." },
      { q: "Where can I find YouTube hashtags to copy and paste?", a: "Right here — enter your topic and this tool generates video hashtags you can copy and paste into your description or title area. Keep them relevant to the video, and use no more than 15 per video." }
    ],
    related: ["youtube-tag-generator", "youtube-title-generator", "instagram-hashtag-generator", "tiktok-hashtag-generator"]
  },
  {
    slug: "youtube-tag-generator", name: "YouTube Tag Generator", category: "youtube-tools",
    title: "Free YouTube Tag Generator Online",
    description: "Generate tag suggestions for your video's tags field, including broad, specific and long-tail variations. Copy the comma-separated list into YouTube Studio.",
    keywords: "youtube tag generator, youtube tags, video tags, youtube tags generator",
    howTo: ["Enter your main keyword or topic.", "Click Generate Tags.", "Copy the comma-separated tags into YouTube Studio."],
    formats: "Comma-separated text output.",
    examples: ["Keyword: drone photography → drone photography, drone shots, aerial photography tips", "Keyword: learn guitar → learn guitar, guitar for beginners, guitar lessons"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Tags are generated from keyword templates in your browser." },
      { q: "Do tags still matter on YouTube?", a: "They play a small role, mainly when viewers misspell a topic. Titles, descriptions and content matter much more." },
      { q: "How many tags should I add?", a: "A focused set of 10–20 relevant tags is enough. Stuffing hundreds of tags does not help." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "What is YouTube's tag character limit?", a: "The tags field holds 500 characters in total, commas included. This generator returns a comma-separated list — paste it into YouTube Studio and trim the least relevant tags if you run over the limit." },
      { q: "What are YouTube tags, and how do I add video tags?", a: "YouTube tags are keywords in your video's tags field that help YouTube understand what the video is about. This YouTube tags generator suggests broad, specific and long-tail video tags — copy the comma-separated list into YouTube Studio." }
    ],
    related: ["youtube-hashtag-generator", "youtube-title-generator", "youtube-description-generator", "word-counter"]
  },
  {
    slug: "youtube-thumbnail-resizer", name: "YouTube Thumbnail Resizer", category: "youtube-tools",
    title: "Free YouTube Thumbnail Resizer (1280 × 720)",
    description: "Resize any image to 1280 × 720 pixels for a YouTube thumbnail. Choose fit or contain, then download — processed locally in your browser, nothing is uploaded.",
    keywords: "youtube thumbnail resizer, 1280x720 thumbnail, resize thumbnail, youtube thumbnail size",
    howTo: ["Upload an image (JPG, PNG or WebP).", "Choose fit (cover) or contain (letterboxed).", "Click Resize Thumbnail.", "Download the 1280 × 720 image."],
    formats: "Input: JPG, PNG, WebP. Output: JPG or PNG at exactly 1280 × 720 px. File size limit: 20 MB.",
    examples: ["A phone photo resized to a crisp 1280 × 720 thumbnail.", "A wide screenshot fitted to thumbnail size without stretching."],
    faqs: [
      { q: "Is my image uploaded to a server?", a: "No. Resizing happens locally with the Canvas API. Your image never leaves your device." },
      { q: "What size does YouTube recommend?", a: "The standard YouTube thumbnail size is 1280 × 720 pixels (16:9). This tool resizes your image to a 1280x720 thumbnail at exactly that size, ready to upload." },
      { q: "Will the image be stretched?", a: "No. Cover mode crops the edges to fill the frame; contain mode keeps the whole image with padding." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "What is the maximum file size for a YouTube thumbnail?", a: "YouTube accepts thumbnails up to 2 MB, at least 640 pixels wide, in JPG, PNG, GIF or WebP. A 1280 × 720 JPG from this tool is usually well under that limit." }
    ],
    related: ["image-resizer", "image-compressor", "video-aspect-ratio-calculator", "jpg-to-png-converter"]
  },
  {
    slug: "video-aspect-ratio-calculator", name: "Video Aspect Ratio Calculator", category: "youtube-tools",
    title: "Free Video Aspect Ratio Calculator Online",
    description: "Calculate aspect ratios (16:9, 9:16, 1:1, 4:5, 4:3, 21:9) and the matching width or height for any video or image size. Enter one side or pick a preset ratio.",
    keywords: "aspect ratio calculator, video aspect ratio, 16:9 calculator, 9:16 calculator, 4:3 calculator, 21:9 calculator, image aspect ratio calculator",
    howTo: ["Enter a width and height, or pick a preset ratio.", "Enter one known side.", "The calculator works out the other side and the simplified ratio."],
    formats: "Numbers only. No files involved.",
    examples: ["1920 × 1080 → 16:9 widescreen (YouTube, desktop video).", "1080 × 1920 → 9:16 vertical (Shorts, Reels, TikTok).", "1080 × 1080 → 1:1 square feed post."],
    faqs: [
      { q: "What is an aspect ratio?", a: "It is the proportional relationship between width and height — for example 16:9 means 16 units wide for every 9 units tall." },
      { q: "Which ratio should I use for YouTube Shorts?", a: "9:16 vertical (1080 × 1920). For standard YouTube videos use 16:9 (1920 × 1080)." },
      { q: "Does the calculator upload anything?", a: "No. It is a plain calculation in your browser." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "How do I find the aspect ratio of an image?", a: "Enter the image's width and height and the calculator shows the simplified ratio — for example 1920 × 1080 becomes 16:9." },
      { q: "Does this work as a 16:9 calculator, or as an image aspect ratio calculator?", a: "Both. It works as a 16:9 calculator, a 9:16 calculator, a 4:3 calculator and a 21:9 calculator — enter a width and height, or pick a preset ratio, and it works out the other side and the simplified ratio for any video or image size." }
    ],
    related: ["youtube-thumbnail-resizer", "instagram-post-size-calculator", "image-resizer", "youtube-earnings-calculator"]
  },
  {
    slug: "youtube-earnings-calculator", name: "YouTube Earnings Calculator", category: "youtube-tools",
    title: "Free YouTube Earnings Calculator (RPM)",
    description: "Estimate YouTube earnings from views and RPM. This is an estimate only — actual revenue depends on audience, niche, season and ads. Try $1, $3 and $8 RPM.",
    keywords: "youtube earnings calculator, youtube money calculator, youtube rpm calculator, how much does youtube pay per view, youtube pay per 1000 views",
    howTo: ["Enter your monthly views.", "Enter an RPM (revenue per 1,000 views) — try $1, $3 and $8 to see the range.", "Read the estimated monthly and yearly earnings."],
    formats: "Numbers only. Formula: estimated earnings = (views ÷ 1,000) × RPM.",
    examples: ["100,000 views at $3 RPM → about $300.", "1,000,000 views at $5 RPM → about $5,000. Both are estimates, not guarantees."],
    faqs: [
      { q: "Is this an exact earnings figure?", a: "No. It is an estimate. Real RPM varies by country, niche, advertiser demand and season, and YouTube takes a share." },
      { q: "What is RPM?", a: "Revenue per mille — the money a creator earns per 1,000 views after YouTube's share, roughly $1–$10 for most channels." },
      { q: "Does watch time or subscribers change the result?", a: "Yes, indirectly. Higher watch time and a valuable audience usually raise RPM, but this calculator only uses views and RPM." },
      { q: "Is my data stored?", a: "No. The calculation runs locally in your browser." },
      { q: "How much does YouTube pay per 1,000 views?", a: "That is your RPM — revenue per 1,000 views after YouTube's share. It varies by niche and audience country; roughly $1–$10 for most channels. Enter your own RPM from YouTube Studio for a better estimate." },
      { q: "What is the difference between CPM and RPM?", a: "CPM is what advertisers pay per 1,000 ad impressions. RPM is what you actually earn per 1,000 views after YouTube's 45% share — and RPM is the number this calculator uses." },
      { q: "How much does YouTube pay per view?", a: "YouTube does not pay a fixed amount per view — what you earn depends on your RPM, the money you earn per 1,000 views after YouTube's share. Use this YouTube money calculator to estimate your earnings from your views and RPM." },
      { q: "What is YouTube pay per 1000 views?", a: "YouTube pay per 1000 views is your RPM — revenue per 1,000 views after YouTube's share. Enter that RPM from YouTube Studio into this YouTube RPM calculator to estimate your monthly earnings." }
    ],
    related: ["video-aspect-ratio-calculator", "youtube-title-generator", "instagram-engagement-calculator", "youtube-shorts-title-generator"]
  },
  {
    slug: "youtube-shorts-title-generator", name: "YouTube Shorts Title Generator", category: "youtube-tools",
    title: "Free YouTube Shorts Title Generator Online",
    description: "Generate short, punchy titles for YouTube Shorts — under 60 characters where possible, built for vertical scrolling. Pick a style and copy your favourite.",
    keywords: "youtube shorts title generator, shorts title ideas, youtube shorts titles, youtube shorts title ideas",
    howTo: ["Enter your Shorts topic.", "Pick a style (hook, how-to or curiosity).", "Click Generate Titles.", "Copy a title under 60 characters if you can."],
    formats: "Text output. Titles aim for under 60 characters so they are not cut off on mobile.",
    examples: ["Topic: 30-second pasta → “30-Second Pasta? Yes, Really.”", "Topic: morning routine → “My 5-Minute Morning Routine”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. It uses templates, not AI, and runs entirely in your browser." },
      { q: "How long should a Shorts title be?", a: "Short — ideally under 60 characters — so it is fully visible on a phone screen." },
      { q: "Can I use these titles for TikTok or Reels too?", a: "Yes, the same short hook-style titles work on other short-video platforms." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "What makes a good Shorts title?", a: "Keep it short and front-load the subject — only the first 40–50 characters show in the Shorts feed on most phones. A hook, a number or a clear result works better than a joke with no topic in it." },
      { q: "Where can I find YouTube Shorts title ideas?", a: "Here — enter your Shorts topic and this tool generates Shorts title ideas and YouTube Shorts titles you can copy, all aiming for under 60 characters so they are not cut off on mobile." }
    ],
    related: ["youtube-title-generator", "tiktok-hook-generator", "tiktok-caption-generator", "youtube-hashtag-generator"]
  },
  {
    slug: "instagram-caption-generator", name: "Instagram Caption Generator", category: "instagram-tools",
    title: "Free Instagram Caption Generator Online",
    description: "Generate Instagram captions for posts and Reels from your topic and mood — short, funny, aesthetic or motivational — using templates, not AI. Copy one.",
    keywords: "instagram caption generator, instagram captions, caption ideas, captions for instagram, instagram reels caption",
    howTo: ["Enter your post topic.", "Pick a mood (aesthetic, funny, motivational or minimal).", "Click Generate Captions.", "Copy your favourite and add your own hashtags."],
    formats: "Text output. Captions are short enough for Instagram posts and Reels.",
    examples: ["Topic: golden hour photo, aesthetic mood → “Chasing light, collecting moments.”", "Topic: gym progress, motivational mood → “Small steps. Every single day.”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Captions come from templates. Your topic never leaves your browser." },
      { q: "How long should an Instagram caption be?", a: "Short captions (under 125 characters) show fully in the feed; longer storytelling captions work when the photo needs context." },
      { q: "Are emojis included?", a: "Some templates include emojis. Remove or change any that do not fit your style." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "Can I use these captions for Reels?", a: "Yes. The same captions work for Reels — keep the hook in the first line, since only about the first 125 characters show before the “more” cut." },
      { q: "Where can I find caption ideas for Instagram?", a: "Use this generator to get caption ideas for posts and Reels — enter your topic, pick a mood, and copy the line that fits. These captions for Instagram work as an Instagram Reels caption too: keep the hook in the first line, since only about the first 125 characters show before the “more” cut." }
    ],
    related: ["instagram-hashtag-generator", "instagram-bio-generator", "tiktok-caption-generator", "instagram-engagement-calculator"]
  },
  {
    slug: "instagram-hashtag-generator", name: "Instagram Hashtag Generator", category: "instagram-tools",
    title: "Free Instagram Hashtag Generator Online",
    description: "Generate relevant Instagram hashtags from your topic, mixing popular and niche tags so your post can be discovered. Copy the 5 that fit into your caption.",
    keywords: "instagram hashtag generator, instagram hashtags, instagram hashtags for reels, instagram hashtag limit",
    howTo: ["Enter your post topic.", "Click Generate Hashtags.", "Copy the 5 hashtags that fit your post best and paste them in your caption or first comment."],
    formats: "Text output. Instagram allows up to 5 hashtags per post — pick the 5 that fit your post best.",
    examples: ["Topic: travel photography → #TravelPhotography #Wanderlust #PhotoOfTheDay", "Topic: home baking → #HomeBaker #BakingLove #FreshBread"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Hashtags are matched from keyword templates in your browser." },
      { q: "How many hashtags should I use?", a: "Instagram allows 5 hashtags per post. Use the 5 most relevant ones — a short, accurate set works better than a long, loose one." },
      { q: "Do hashtags guarantee reach?", a: "No. They help discovery, but the photo, caption and engagement matter more." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "Can I use these hashtags for Reels?", a: "Yes — the same 5-hashtag limit applies to Reels, and the same tags work there." },
      { q: "What is the Instagram hashtag limit for Reels?", a: "The Instagram hashtag limit is 5 hashtags per post, and the same limit applies to Reels. The generator gives you a pool of tags, so choose the 5 Instagram hashtags for Reels that fit your post." }
    ],
    related: ["instagram-caption-generator", "youtube-hashtag-generator", "tiktok-hashtag-generator", "instagram-bio-generator"]
  },
  {
    slug: "instagram-bio-generator", name: "Instagram Bio Generator", category: "instagram-tools",
    title: "Free Instagram Bio Generator Online",
    description: "Generate a short Instagram bio from your name, niche and vibe — under 150 characters, ready to paste. Pick your vibe: clean, creative or professional.",
    keywords: "instagram bio generator, instagram bio ideas, instagram profile bio",
    howTo: ["Enter your name or handle and your niche.", "Pick a vibe (clean, creative or professional).", "Click Generate Bios.", "Copy one under 150 characters into your profile."],
    formats: "Text output. Instagram bios are limited to 150 characters.",
    examples: ["Niche: food blogger → “Tasting my way through the city, one plate at a time.”", "Niche: fitness coach → “Helping busy people get strong | Coach | DM ‘START’”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Bios are built from templates in your browser." },
      { q: "How long can an Instagram bio be?", a: "150 characters. This generator aims to stay under that limit." },
      { q: "Can I add emojis and line breaks?", a: "Yes — edit the generated bio to add emojis or line breaks before pasting it in." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "What should I put in my Instagram bio?", a: "Three things: who you are, what followers get, and one call to action. Put your main keyword first — Instagram search reads the bio — and keep it under 150 characters." },
      { q: "Where can I find Instagram bio ideas for my profile?", a: "Use this generator to turn your name, niche and vibe into an Instagram profile bio under 150 characters. Try a few options, then keep the one that says who you are, what followers get, and one call to action." }
    ],
    related: ["instagram-caption-generator", "instagram-hashtag-generator", "instagram-engagement-calculator", "word-counter"]
  },
  {
    slug: "instagram-post-size-calculator", name: "Instagram Post Size Calculator", category: "instagram-tools",
    title: "Free Instagram Post Size Calculator Online",
    description: "Find the right size for Instagram posts, Reels, Stories and profile pictures — square, portrait, landscape, vertical. Square 1080 × 1080, Story 1080 × 1920.",
    keywords: "instagram post size, instagram dimensions, instagram image size, instagram story size, instagram reel size",
    howTo: ["Pick a format (feed square, portrait, landscape, Story/Reel or profile picture).", "Read the recommended pixel size and ratio.", "Resize your image to match before uploading."],
    formats: "Reference sizes: square 1080 × 1080 (1:1), portrait 1080 × 1350 (4:5), landscape 1080 × 566 (1.91:1), Story/Reel 1080 × 1920 (9:16).",
    examples: ["Feed square post → 1080 × 1080.", "Story or Reel → 1080 × 1920 vertical.", "Portrait feed post → 1080 × 1350 (4:5) — the tallest a feed photo can be."],
    faqs: [
      { q: "What size should an Instagram feed photo be?", a: "1080 × 1080 for square, or 1080 × 1350 for portrait (4:5), which uses more screen space." },
      { q: "What size are Instagram Stories?", a: "1080 × 1920 pixels (9:16 vertical). Keep important text away from the top and bottom edges." },
      { q: "Does Instagram compress my photos?", a: "Yes, Instagram compresses uploads, so starting from the recommended size gives the best result." },
      { q: "Is this calculator free?", a: "Yes, free with no sign-up." },
      { q: "What are the Instagram dimensions for an image, a Story and a Reel?", a: "The Instagram dimensions in this calculator are: Instagram image size 1080 × 1080 for a square feed post (or 1080 × 1350 portrait), Instagram story size 1080 × 1920 (9:16), and Instagram reel size 1080 × 1920 (9:16). Pick the format first, then resize your image to match before uploading." }
    ],
    related: ["image-resizer", "video-aspect-ratio-calculator", "youtube-thumbnail-resizer", "instagram-engagement-calculator"]
  },
  {
    slug: "instagram-engagement-calculator", name: "Instagram Engagement Calculator", category: "instagram-tools",
    title: "Free Instagram Engagement Calculator Online",
    description: "Calculate your Instagram engagement rate from likes, comments, saves and followers. Formula shown, no data stored. Enter your numbers and read the rate.",
    keywords: "instagram engagement calculator, engagement rate calculator, instagram engagement rate checker",
    howTo: ["Enter likes, comments and saves for a post (or averages).", "Enter your follower count.", "Read the engagement rate."],
    formats: "Numbers only. Formula: engagement rate = ((likes + comments + saves) ÷ followers) × 100.",
    examples: ["1,200 likes + 80 comments on 20,000 followers → about 6.4% engagement.", "A rate of 1–3% is typical; above 3% is strong for most accounts."],
    faqs: [
      { q: "What is a good Instagram engagement rate?", a: "Roughly 1–3% is typical. Smaller accounts often see higher rates; very large accounts often see lower ones." },
      { q: "Should I include saves and shares?", a: "Yes — saves and shares are strong signals. This calculator includes saves; add shares to the comments field if you want them counted." },
      { q: "Is my account data stored?", a: "No. The calculation runs locally in your browser." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "Can I check another account's engagement rate?", a: "You need that account's public numbers — likes, comments and follower count. Saves, shares and reach are only visible to the account owner in Instagram Insights, so this calculator works from follower count." },
      { q: "What is engagement rate by reach?", a: "The same engagements divided by reach instead of followers. Reach is a truer denominator, but only the account owner can see it in Insights." },
      { q: "Is this an Instagram engagement rate checker?", a: "Yes — use it as an engagement rate calculator: enter likes, comments and saves plus your follower count, and it works out the engagement rate with the formula shown. It runs locally in your browser and stores no account data." }
    ],
    related: ["instagram-caption-generator", "instagram-post-size-calculator", "youtube-earnings-calculator", "instagram-bio-generator"]
  },
  {
    slug: "tiktok-hook-generator", name: "TikTok Hook Generator", category: "tiktok-tools",
    title: "Free TikTok Hook Generator Online",
    description: "Generate scroll-stopping opening lines for TikTok videos — the first 3 seconds decide whether viewers stay. Pick a style and say it in the first 3 seconds.",
    keywords: "tiktok hook generator, tiktok hooks, video hook ideas, tiktok hook ideas",
    howTo: ["Enter your video topic.", "Pick a hook style (curiosity, bold claim or mistake).", "Click Generate Hooks.", "Say the hook in the first 3 seconds of your video."],
    formats: "Text output. Hooks are one short spoken line.",
    examples: ["Topic: budgeting → “Stop doing this with your salary.”", "Topic: skincare → “I tried this for 30 days — here is what happened.”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Hooks are built from templates in your browser." },
      { q: "Why do hooks matter on TikTok?", a: "Viewers decide in about 3 seconds whether to keep watching. A clear hook earns those seconds." },
      { q: "Should the hook match the video?", a: "Yes — a hook that overpromises and under-delivers hurts watch time and trust." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "What makes a good TikTok hook?", a: "Say something specific in the first 2–3 seconds — a curiosity gap, a number, a bold claim, or a direct callout of who the video is for. Never open with a greeting or an introduction." },
      { q: "Where can I find TikTok hook ideas for my videos?", a: "Use this generator for video hook ideas: enter your topic, pick a style, and copy a line to say in the first 3 seconds. These TikTok hooks are one short spoken line, so keep the hook specific and matching what the video delivers." }
    ],
    related: ["tiktok-caption-generator", "youtube-shorts-title-generator", "tiktok-hashtag-generator", "youtube-title-generator"]
  },
  {
    slug: "tiktok-caption-generator", name: "TikTok Caption Generator", category: "tiktok-tools",
    title: "Free TikTok Caption Generator Online",
    description: "Generate short TikTok captions from your topic — conversational, punchy and under the 2,200-character limit. Pick a funny, casual or informative tone.",
    keywords: "tiktok caption generator, tiktok captions, tiktok caption ideas, caption for tiktok",
    howTo: ["Enter your video topic.", "Pick a tone (funny, casual or informative).", "Click Generate Captions.", "Copy one and add 3–5 hashtags."],
    formats: "Text output. TikTok captions can be up to 2,200 characters, but short captions usually perform better.",
    examples: ["Topic: morning coffee → “POV: the first sip hits different.”", "Topic: study tips → “Study smarter, not longer. Save this.”"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Captions are generated from templates in your browser." },
      { q: "How long should a TikTok caption be?", a: "Short — one or two lines plus hashtags. Most viewers read the video, not a long caption." },
      { q: "Can I use these on Reels or Shorts too?", a: "Yes, short casual captions transfer well across short-video platforms." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "How long can a TikTok caption be?", a: "TikTok captions for videos can be up to 2,200 characters — that is the limit in TikTok's Content Posting API reference for the video caption field. The 4,000-character figure applies to photo-post descriptions, not video captions. Short captions of one or two lines usually work better than long ones." },
      { q: "Where can I find TikTok caption ideas?", a: "Use this generator to get a caption for TikTok from your topic and tone — conversational, punchy and short. Try a few TikTok caption ideas, then copy the one that fits your video and add 3–5 hashtags." }
    ],
    related: ["tiktok-hook-generator", "tiktok-hashtag-generator", "instagram-caption-generator", "youtube-shorts-title-generator"]
  },
  {
    slug: "tiktok-hashtag-generator", name: "TikTok Hashtag Generator", category: "tiktok-tools",
    title: "Free TikTok Hashtag Generator Online",
    description: "Generate relevant TikTok hashtags from your topic, mixing broad discovery tags with niche ones. Copy 3–5 into your caption — TikTok caps captions at 5 hashtags.",
    keywords: "tiktok hashtag generator, tiktok hashtags, hashtags for tiktok, tiktok hashtag ideas, tiktok tag generator",
    howTo: ["Enter your video topic.", "Click Generate Hashtags.", "Copy 3–5 hashtags into your caption."],
    formats: "Text output. 3–5 relevant hashtags per video is a good starting point.",
    examples: ["Topic: easy recipes → #EasyRecipes #FoodTok #QuickMeals", "Topic: thrift finds → #ThriftFinds #ThriftHaul #SustainableFashion"],
    faqs: [
      { q: "Does this tool use AI?", a: "No. Hashtags are matched from keyword templates in your browser." },
      { q: "How many hashtags should I use on TikTok?", a: "3–5 relevant hashtags is enough — TikTok's composer caps a caption at 5 hashtags. More tags do not mean more reach." },
      { q: "Do hashtags guarantee going viral?", a: "No. They help TikTok understand the video, but watch time and shares matter far more." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "Where can I find TikTok hashtag ideas?", a: "Use this generator as a TikTok tag generator: enter your video topic and it suggests hashtags for TikTok, mixing broad discovery tags with niche ones. Copy at most 5 of the 10 suggested tags into your caption — TikTok's composer caps a caption at 5 hashtags." }
    ],
    related: ["tiktok-hook-generator", "tiktok-caption-generator", "instagram-hashtag-generator", "youtube-hashtag-generator"]
  },
  {
    slug: "image-compressor", name: "Image Compressor", category: "image-tools",
    title: "Free Image Compressor Online (No Upload)",
    description: "Compress JPG, PNG and WebP images in your browser. Adjust quality and download smaller files — no upload. Photos often shrink 50–80% at 70–80% quality.",
    keywords: "image compressor, compress jpg, compress png, reduce image size, photo compressor, compress image online",
    howTo: ["Upload an image (JPG, PNG or WebP, up to 20 MB).", "Choose a quality level.", "Click Compress Image.", "Download the compressed file and compare sizes."],
    formats: "Input: JPG, PNG, WebP. Output: same format where possible; PNG transparency is preserved when output is PNG/WebP. JPG has no transparency.",
    examples: ["A 4 MB phone photo compressed to under 800 KB at 80% quality.", "A PNG screenshot with transparency kept as PNG so the transparent areas survive."],
    faqs: [
      { q: "Is my image uploaded to a server?", a: "No. Compression runs entirely in your browser with a local library. Your image never leaves your device." },
      { q: "Does compression preserve transparency?", a: "Yes, when the output format supports it (PNG or WebP). JPG cannot store transparency, so transparent areas become a solid background." },
      { q: "How much smaller will my image get?", a: "It depends on the image. Photos often shrink 50–80% at 70–80% quality with little visible loss; simple graphics shrink less." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "What quality should I choose?", a: "70–80% is a good balance for photos — much smaller files with little visible loss. Use higher quality for graphics with text or sharp lines." },
      { q: "Can I use this tool to reduce image size?", a: "Yes. Upload a JPG, PNG or WebP image, choose a quality level, then download the smaller file \u2014 compression runs in your browser, so nothing is uploaded." },
      { q: "Can I compress PNG images here?", a: "Yes. Upload a PNG image, choose a quality level and download the compressed file. PNG transparency is preserved when the output is PNG or WebP." },
      { q: "Is this a photo compressor for phone pictures?", a: "Yes. Upload a phone photo, choose a quality level and download the smaller file. Compression runs entirely in your browser, so the photo never leaves your device." },
      { q: "Can I compress image online without uploading it?", a: "Yes. The tool runs entirely in your browser, so there is no upload and no sign-up." },
    ],
    related: ["image-resizer", "jpg-to-png-converter", "youtube-thumbnail-resizer", "instagram-post-size-calculator"]
  },
  {
    slug: "image-resizer", name: "Image Resizer", category: "image-tools",
    title: "Free Image Resizer Online (No Upload)",
    description: "Resize images to exact dimensions with maintain-aspect-ratio, fit or crop options — processed locally, no upload. Enter width or height and download the result.",
    keywords: "image resizer, resize image online, resize photo, photo resizer, resize photo online",
    howTo: ["Upload an image (JPG, PNG or WebP).", "Enter a target width and/or height.", "Choose maintain aspect ratio, fit or crop.", "Download the resized image."],
    formats: "Input: JPG, PNG, WebP. Output: JPG or PNG. High-quality resize via the Pica library, loaded on demand.",
    examples: ["A 4000 × 3000 photo resized to 1200 × 900 for a blog.", "A square profile picture cropped to 500 × 500."],
    faqs: [
      { q: "Is my image uploaded to a server?", a: "No. Resizing happens locally in your browser." },
      { q: "What does maintain aspect ratio do?", a: "It locks the width-to-height proportion, so entering a width automatically sets the matching height and the image is never stretched." },
      { q: "Fit vs crop — what is the difference?", a: "Fit keeps the whole image inside the target size with padding; crop fills the target size and trims the edges." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "Can I resize an image without cropping it?", a: "Yes. Choose Fit — it keeps the whole image inside the target size with padding. Crop fills the target size and trims the edges instead." },
      { q: "Can I resize image online without uploading it?", a: "Yes. Resizing happens locally in your browser \u2014 upload an image, enter a target width and/or height, and download the resized image." },
      { q: "Can I resize photo files with this tool?", a: "Yes. Upload a JPG, PNG or WebP photo, enter a target width and/or height, choose maintain aspect ratio, fit or crop, and download the resized image." },
      { q: "Is this a photo resizer?", a: "Yes. Upload an image, enter a target width and/or height, and download the resized file. Resizing happens locally in your browser, with no sign-up." },
      { q: "Can I resize photo online for free?", a: "Yes. The tool is free with no sign-up, and resizing happens locally in your browser." },
    ],
    related: ["image-compressor", "jpg-to-png-converter", "youtube-thumbnail-resizer", "instagram-post-size-calculator"]
  },
  {
    slug: "jpg-to-png-converter", name: "JPG to PNG Converter", category: "image-tools",
    title: "Free JPG to PNG Converter (No Upload)",
    description: "Convert JPG images to PNG in your browser. No upload, no sign-up — your file never leaves your device. JPG and JPEG are the same format, so both work here.",
    keywords: "jpg to png converter, convert jpg to png, jpeg to png converter, convert jpeg to png",
    howTo: ["Upload a JPG image.", "Click Convert to PNG.", "Download the PNG file."],
    formats: "Input: JPG/JPEG. Output: PNG. Note: converting JPG to PNG does not restore quality lost in JPG compression, and PNG files are usually larger.",
    examples: ["A JPG photo converted to PNG for use in a design tool that needs PNG.", "A JPG logo converted to PNG before adding transparency in an editor."],
    faqs: [
      { q: "Is my image uploaded to a server?", a: "No. Conversion uses the Canvas API locally in your browser." },
      { q: "Will PNG look better than the JPG?", a: "No — conversion cannot add back detail lost when the JPG was compressed. PNG is lossless from this point on, but the starting quality stays the same." },
      { q: "Why is the PNG larger?", a: "PNG is a lossless format, so it stores more data than a compressed JPG. That is normal." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "Is JPG the same as JPEG?", a: "Yes — JPG and JPEG are the same format with a different file extension. Both work in this converter." },
      { q: "How do I convert JPG to PNG?", a: "Upload a JPG image, click Convert to PNG, and download the PNG file." },
      { q: "Is this a JPEG to PNG converter?", a: "Yes. JPG and JPEG are the same format with a different file extension, so JPEG files work in this converter too." },
      { q: "Can I convert JPEG to PNG here?", a: "Yes. Upload a JPEG image, click Convert to PNG, and download the PNG file. The PNG is lossless from this point on, but it cannot add back detail lost when the JPG was compressed." },
    ],
    related: ["image-compressor", "image-resizer", "youtube-thumbnail-resizer", "word-counter"]
  },
  {
    slug: "word-counter", name: "Word Counter", category: "text-tools",
    title: "Free Online Word Counter",
    description: "Count words, characters, sentences, paragraphs and reading time in any text — free, instant, and private. Counts update live as you type, and nothing is stored.",
    keywords: "word counter, character counter, count words online, sentence counter, paragraph counter, reading time calculator",
    howTo: ["Paste or type your text in the box.", "Counts update live as you type.", "Use Copy or Reset to start again."],
    formats: "Plain text input. No file upload. Text is never sent to a server.",
    examples: ["A 500-word essay → about 2–3 minutes reading time.", "A tweet draft checked against character limits before posting."],
    faqs: [
      { q: "What is a word counter?", a: "A tool that counts the words, characters, sentences and paragraphs in a piece of text, and estimates how long it takes to read." },
      { q: "Does the word count include punctuation?", a: "Punctuation attached to a word does not create an extra word. Numbers count as words; standalone symbols usually do not." },
      { q: "What is the difference between words and characters?", a: "Words are separated by spaces; characters include every letter, space and punctuation mark. Character counts include spaces unless stated otherwise — this tool shows both." },
      { q: "Is my text uploaded to a server?", a: "No. Counting runs locally in your browser and your text is never stored or sent anywhere." },
      { q: "Is the tool free?", a: "Yes, completely free with no sign-up." },
      { q: "What does the word counter show?", a: "Words, characters with spaces, characters without spaces, sentences, paragraphs and estimated reading time — all updating live as you type." },
      { q: "Can I use this as a character counter?", a: "Yes. It shows characters with spaces and characters without spaces, alongside words, sentences, paragraphs and estimated reading time." },
      { q: "Can I count words online without signing up?", a: "Yes. Paste or type your text and the counts update live as you type. The tool is free with no sign-up, and your text never leaves your browser." },
      { q: "Does this work as a sentence counter?", a: "Yes. Sentences are counted live as you type, along with words, characters, paragraphs and estimated reading time." },
      { q: "Does this work as a paragraph counter?", a: "Yes. Paragraphs are counted live as you type, along with words, characters, sentences and estimated reading time." },
      { q: "Is this a reading time calculator?", a: "Yes. It estimates reading time from your word count at about 200 words per minute \u2014 a 500-word essay works out at about 2\u20133 minutes." },
    ],
    related: ["text-case-converter", "youtube-description-generator", "instagram-bio-generator", "instagram-caption-generator"]
  },
  {
    slug: "text-case-converter", name: "Text Case Converter", category: "text-tools",
    title: "Free Text Case Converter Online",
    description: "Convert text to UPPERCASE, lowercase, Title Case, Sentence case and more — free, instant, private. Paste your text, click a case button and copy the result.",
    keywords: "text case converter, uppercase lowercase converter, title case converter, sentence case converter, uppercase to lowercase converter",
    howTo: ["Paste or type your text.", "Click a case button (UPPERCASE, lowercase, Title Case, Sentence case, aLtErNaTiNg).", "Copy the converted text."],
    formats: "Plain text input and output. No file upload.",
    examples: ["“hello world” → Title Case → “Hello World”.", "A SHOUTY HEADING → lowercase → “a shouty heading”."],
    faqs: [
      { q: "What cases are supported?", a: "UPPERCASE, lowercase, Title Case, Sentence case, Capitalized Words and aLtErNaTiNg case." },
      { q: "Is my text uploaded to a server?", a: "No. Conversion runs locally in your browser." },
      { q: "Does Title Case handle small words like “and” or “the”?", a: "This converter capitalises each word. For formal titles, check style-guide rules for small words before publishing." },
      { q: "Is it free?", a: "Yes, free with no sign-up." },
      { q: "What is sentence case?", a: "Sentence case capitalises only the first letter of each sentence — the rest stays lowercase. Use it for emails and essays typed in all caps." },
      { q: "Is this an uppercase lowercase converter?", a: "Yes. Paste your text and click UPPERCASE or lowercase to convert it, or choose Title Case, Sentence case, Capitalized Words or aLtErNaTiNg case." },
      { q: "Can I use this as a title case converter?", a: "Yes. Click Title Case to capitalise each word of your text. For formal titles, check style-guide rules for small words before publishing." },
      { q: "Can I use this as a sentence case converter?", a: "Yes. Click Sentence case to capitalise only the first letter of each sentence \u2014 the rest stays lowercase." },
      { q: "Can I use this as an uppercase to lowercase converter?", a: "Yes. Paste text in capitals and click lowercase \u2014 for example, \u201cA SHOUTY HEADING\u201d becomes \u201ca shouty heading\u201d." },
    ],
    related: ["word-counter", "youtube-title-generator", "instagram-bio-generator", "youtube-description-generator"]
  },
  {
    slug: "percentage-calculator", name: "Percentage Calculator", category: "calculator-tools",
    title: "Free Percentage Calculator Online",
    description: "Work out percentages three ways: what X% of a number is, one number as a percentage of another, and percentage increase or decrease. Free, instant, with the formula shown.",
    keywords: "percentage calculator, percent calculator, percent increase calculator, percentage decrease calculator, how to calculate percentage",
    howTo: ["Pick a calculation: X% of Y, X as a % of Y, or % increase/decrease.", "Enter the two numbers.", "Click Calculate Percentage.", "Copy the result with the formula shown."],
    formats: "Numbers only. No files involved. Formulas: (percentage ÷ 100) × value; (part ÷ whole) × 100; ((new − old) ÷ old) × 100.",
    examples: ["20% of 250 → 50.", "80 to 100 → a 25% increase."],
    faqs: [
      { q: "How do I calculate a percentage of a number?", a: "Multiply the number by the percentage divided by 100. For example, 20% of 250 is (20 ÷ 100) × 250 = 50. This percentage calculator does the same sum for you." },
      { q: "How do I work out X as a percentage of Y?", a: "Divide X by Y and multiply by 100. For example, 50 as a percentage of 200 is (50 ÷ 200) × 100 = 25%." },
      { q: "How do I calculate percentage increase?", a: "Subtract the old value from the new value, divide by the old value and multiply by 100. For example, 80 to 100 is ((100 − 80) ÷ 80) × 100 = a 25% increase." },
      { q: "What is the difference between percentage increase and percentage points?", a: "A percentage increase is relative to the starting value — 80 to 100 is a 25% increase. Percentage points are the plain difference between two percentages — 20% to 25% is a rise of 5 percentage points." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["age-calculator", "bmi-calculator", "loan-emi-calculator", "unit-converter"]
  },
  {
    slug: "age-calculator", name: "Age Calculator", category: "calculator-tools",
    title: "Free Age Calculator Online",
    description: "Work out your exact age in years, months and days from your date of birth, plus total days lived. Leap years handled correctly; future dates rejected.",
    keywords: "age calculator, how old am i, calculate age from date of birth, age in years months days",
    howTo: ["Pick your date of birth.", "Click Calculate Age.", "Read your exact age in years, months and days, plus total days lived."],
    formats: "A date of birth. No files involved. Age is counted on the calendar, so leap years and month lengths are handled correctly.",
    examples: ["Born 1 January 2000 → 26 years, 10 months, 9 days on 10 November 2026.", "Born 29 February 2000 → 26 years, 8 months, 12 days on 10 November 2026."],
    faqs: [
      { q: "How is my exact age calculated?", a: "By counting full calendar years, then months, then days from your date of birth to today — borrowing days from the previous month and months from the previous year where needed, the way a calendar does." },
      { q: "Does it handle leap years and 29 February birthdays?", a: "Yes. The count uses real calendar month lengths, so a 29 February birthday is counted correctly — born 29 February 2000, you are 26 years, 8 months and 12 days old on 10 November 2026." },
      { q: "Can I enter a future date of birth?", a: "No — a future date is rejected with a message, because an age cannot be negative." },
      { q: "What does total days lived mean?", a: "The number of whole days from your date of birth to today. For example, born 1 January 2000, that is 9,810 days on 10 November 2026." },
      { q: "Does this tool use AI?", a: "No. It is a plain date calculation in your browser, not AI." },
      { q: "Is my date of birth uploaded or stored?", a: "No. The calculation runs locally in your browser and your date of birth is never sent to a server or stored." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["percentage-calculator", "bmi-calculator", "unit-converter", "word-counter"]
  },
  {
    slug: "bmi-calculator", name: "BMI Calculator", category: "calculator-tools",
    title: "Free BMI Calculator Online",
    description: "Calculate your Body Mass Index from weight and height in metric or imperial units, with the formula and WHO categories shown. An estimate only — not medical advice.",
    keywords: "bmi calculator, body mass index calculator, calculate bmi, bmi chart, healthy bmi range",
    howTo: ["Pick metric (kg, cm) or imperial (lb, ft/in).", "Enter your weight and height.", "Click Calculate BMI.", "Read your BMI and its WHO category."],
    formats: "Numbers only. Metric formula: weight (kg) ÷ height (m)². Imperial formula: 703 × weight (lb) ÷ height (in)².",
    examples: ["70 kg at 175 cm → BMI 22.86, Healthy weight.", "154 lb at 5 ft 9 in → BMI 22.74, Healthy weight."],
    faqs: [
      { q: "How is BMI calculated?", a: "Metric: weight in kilograms divided by height in metres squared. For example, 70 kg at 175 cm is 70 ÷ 1.75² = 22.86. Imperial: 703 × weight in pounds divided by height in inches squared." },
      { q: "What are the WHO BMI categories?", a: "Under 18.5 Underweight, 18.5–24.9 Healthy weight, 25–29.9 Overweight, and 30 and above Obese. They are population screening bands, not a diagnosis for one person." },
      { q: "Is BMI accurate for everyone?", a: "No. BMI does not measure body fat, muscle or health on its own. Muscular people, older adults, children and pregnant people should not rely on it alone — it is a screening guide." },
      { q: "What is a healthy BMI?", a: "The WHO healthy range is 18.5–24.9. A value inside that range is a good sign, but it is not a guarantee of health on its own." },
      { q: "Is this medical advice?", a: "No. This calculator gives an estimate only and is not medical advice. Talk to a doctor for health decisions." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["age-calculator", "percentage-calculator", "loan-emi-calculator", "unit-converter"]
  },
  {
    slug: "loan-emi-calculator", name: "Loan EMI Calculator", category: "calculator-tools",
    title: "Free Loan EMI Calculator Online",
    description: "Work out your monthly loan EMI from the loan amount, annual interest rate and tenure, with total interest and total payment. An estimate only — not financial advice.",
    keywords: "loan emi calculator, emi calculator, monthly emi calculator, loan interest calculator, how to calculate emi",
    howTo: ["Enter the loan amount.", "Enter the annual interest rate.", "Enter the tenure in years.", "Click Calculate EMI and read the monthly EMI, total interest and total payment."],
    formats: "Numbers only. Formula: EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where r is the monthly rate (annual rate ÷ 12) and n is the tenure in months.",
    examples: ["100,000 at 10% annual interest for 5 years → monthly EMI about 2,124.70, total interest about 27,482.27.", "At 0% interest the EMI is simply the loan amount divided by the number of months."],
    faqs: [
      { q: "How is EMI calculated?", a: "EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12) and n is the tenure in months. For example, 100,000 at 10% for 5 years gives a monthly EMI of about 2,124.70." },
      { q: "What is the difference between EMI, total interest and total payment?", a: "The EMI is what you pay each month. Total payment is the EMI multiplied by the number of months. Total interest is total payment minus the loan amount — for 100,000 at 10% over 5 years, that is about 27,482.27." },
      { q: "Does a longer tenure mean a lower EMI?", a: "Yes, a longer tenure lowers the monthly EMI, but you pay more total interest because interest runs for longer. Compare both numbers, not just the EMI." },
      { q: "What happens with a 0% interest rate?", a: "The EMI is the loan amount divided by the number of months, with no interest — for example 100,000 over 5 years is about 1,666.67 a month." },
      { q: "Is this an exact loan payment?", a: "No, it is an estimate. Real loan payments depend on the lender's exact rate, fees and schedule, which this calculator does not include." },
      { q: "Is this financial advice?", a: "No. This calculator gives an estimate only and is not financial advice. Check the lender's own figures before borrowing." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["percentage-calculator", "bmi-calculator", "age-calculator", "youtube-earnings-calculator"]
  },
  {
    slug: "unit-converter", name: "Unit Converter", category: "calculator-tools",
    title: "Free Unit Converter Online",
    description: "Convert length, weight and temperature between metric and imperial units with fixed conversion factors. No currency — exchange rates change daily. Free, instant, private.",
    keywords: "unit converter, length converter, km to miles, kg to pounds, celsius to fahrenheit, convert units online",
    howTo: ["Pick length, weight or temperature.", "Enter a value and pick the from and to units.", "Click Convert.", "Copy the result."],
    formats: "Numbers only. Fixed factors: 1 km = 1000 m, 1 mile = 1609.344 m, 1 kg = 2.20462 lb, 1 oz = 28.3495 g. Temperature: °F = °C × 9/5 + 32; K = °C + 273.15.",
    examples: ["5 km = 3.1069 miles.", "100 °C = 212 °F."],
    faqs: [
      { q: "What units can I convert?", a: "Length (mm, cm, m, km, inches, feet, yards, miles), weight (g, kg, lb, oz) and temperature (Celsius, Fahrenheit, Kelvin). Currency is not included because exchange rates change daily." },
      { q: "How many kilometres are in a mile?", a: "One mile is 1.609344 kilometres, so 5 km is 3.1069 miles and 1 mile is 1.6093 km." },
      { q: "How do I convert Celsius to Fahrenheit?", a: "Multiply by 9/5 and add 32. For example, 100 °C × 9/5 + 32 = 212 °F. To go back, subtract 32 and multiply by 5/9." },
      { q: "How many pounds are in a kilogram?", a: "One kilogram is 2.20462 pounds, so 2.5 kg is 5.5116 lb." },
      { q: "Why is there no currency converter?", a: "Exchange rates change every day, so a currency converter would need live rates. This tool only converts units with fixed factors, so its answers never go stale." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation with fixed factors in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The conversion runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["percentage-calculator", "age-calculator", "bmi-calculator", "video-aspect-ratio-calculator"]
  },
  {
    slug: "compound-interest-calculator", name: "Compound Interest Calculator", category: "calculator-tools",
    title: "Free Compound Interest Calculator",
    description: "Work out how savings or an investment grows with compound interest — final amount and total interest earned, with the formula shown. An estimate only.",
    keywords: "compound interest calculator, compound interest formula, investment growth calculator, savings interest calculator, calculate compound interest",
    howTo: ["Enter the principal amount.", "Enter the annual interest or return rate.", "Pick the compounding frequency and the years.", "Click Calculate Compound Interest."],
    formats: "Numbers only. Formula: A = P × (1 + r/n)^(n×t), where P is the principal, r the annual rate, n the compounding frequency and t the years.",
    examples: ["100,000 at 10% a year, compounded monthly for 5 years → about 164,530.89, of which about 64,530.89 is interest.", "100,000 at 10% compounded yearly for 5 years → about 161,051.00."],
    faqs: [
      { q: "How is compound interest calculated?", a: "A = P × (1 + r/n)^(n×t). For example, 100,000 at 10% a year compounded monthly for 5 years is 100,000 × (1 + 0.10/12)^60 = about 164,530.89." },
      { q: "What is the difference between compound and simple interest?", a: "Simple interest only earns on the principal. Compound interest earns on the principal plus the interest already earned, so the amount grows faster over time." },
      { q: "Does compounding more often earn more?", a: "Yes, slightly. Monthly compounding earns a little more than yearly compounding at the same rate — 100,000 at 10% for 5 years is about 164,530.89 monthly versus about 161,051.00 yearly." },
      { q: "Is the result guaranteed?", a: "No. It is an estimate that assumes a fixed rate for the whole period. Real investments vary, and no investment guarantees a fixed return." },
      { q: "Is this financial advice?", a: "No. This calculator gives an estimate only and is not financial advice." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["sip-calculator", "loan-emi-calculator", "percentage-calculator", "mortgage-calculator"]
  },
  {
    slug: "calorie-calculator", name: "Calorie Calculator", category: "calculator-tools",
    title: "Free Calorie Calculator Online",
    description: "Estimate your daily calorie needs — BMR from the Mifflin-St Jeor formula and maintenance calories (TDEE) for your activity level. An estimate only, not medical advice.",
    keywords: "calorie calculator, bmr calculator, tdee calculator, daily calorie needs, how many calories per day",
    howTo: ["Pick male or female.", "Enter your age, weight and height.", "Pick your activity level.", "Click Calculate Calories."],
    formats: "Numbers only. Mifflin-St Jeor: men 10 × weight + 6.25 × height − 5 × age + 5; women the same with − 161 instead of + 5. TDEE = BMR × activity factor.",
    examples: ["A 30-year-old man, 80 kg, 180 cm, moderately active → BMR about 1,780 kcal/day, maintenance about 2,759 kcal/day.", "A 25-year-old woman, 60 kg, 165 cm, lightly active → BMR about 1,345 kcal/day, maintenance about 1,850 kcal/day."],
    faqs: [
      { q: "What is BMR?", a: "Basal metabolic rate — the calories your body burns at complete rest to keep you alive. It is the starting point; your activity level is added on top to get maintenance calories." },
      { q: "What is TDEE?", a: "Total daily energy expenditure — your BMR multiplied by an activity factor. It estimates the calories you need each day to maintain your current weight." },
      { q: "How is BMR calculated here?", a: "With the Mifflin-St Jeor formula. For men: 10 × weight in kg + 6.25 × height in cm − 5 × age + 5. For women the same formula ends with − 161 instead of + 5." },
      { q: "How many calories do I need to lose weight?", a: "As a rough guide, eating about 300–500 kcal a day below your maintenance (TDEE) level is a common starting point — but this is general information, not a plan. Ask a doctor or dietitian before changing your diet." },
      { q: "Is this medical advice?", a: "No. This calculator gives an estimate only and is not medical advice. Real calorie needs vary with body composition, health and routine." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["bmi-calculator", "daily-water-intake-calculator", "age-calculator", "percentage-calculator"]
  },
  {
    slug: "cgpa-calculator", name: "CGPA Calculator", category: "calculator-tools",
    title: "Free CGPA Calculator Online",
    description: "Calculate your CGPA on the 4.0 scale — add courses with credit hours and grades and get your cumulative GPA, as used at Pakistani and international universities.",
    keywords: "cgpa calculator, gpa calculator, calculate cgpa, university gpa calculator, 4.0 cgpa calculator",
    howTo: ["Enter each course's credit hours and grade.", "Click Add course for more courses.", "Click Calculate CGPA.", "Copy the result."],
    formats: "Credit hours and grades. Formula: CGPA = total grade points ÷ total credit hours, where each course contributes credit hours × grade points on the 4.0 scale (A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0).",
    examples: ["3 credit hours at A (4.0), 3 at B+ (3.3) and 4 at A− (3.7) → CGPA 3.67.", "Two 3-credit courses, one A and one B → (12 + 9) ÷ 6 = CGPA 3.50."],
    faqs: [
      { q: "How is CGPA calculated?", a: "Multiply each course's credit hours by its grade points, add them up, and divide by the total credit hours. For example, 3 credits at A (4.0), 3 at B+ (3.3) and 4 at A− (3.7) gives (12 + 9.9 + 14.8) ÷ 10 = 3.67." },
      { q: "Which grading scale does this use?", a: "The 4.0 scale common at Pakistani universities such as NUST, FAST and COMSATS, and at international universities: A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D = 1.0, F = 0." },
      { q: "What if my university uses different grade points?", a: "Then the result will differ. Check your university's grading policy — some use 4.0 with different points for A− or B+, and some use a different scale entirely." },
      { q: "What is the difference between GPA and CGPA?", a: "GPA is for one semester; CGPA is cumulative across all semesters. This calculator gives a CGPA for all the courses you enter." },
      { q: "Can I add more courses?", a: "Yes — click Add course as many times as you need, and remove any course with its Remove button." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["percentage-calculator", "age-calculator", "unit-converter", "word-counter"]
  },
  {
    slug: "zakat-calculator", name: "Zakat Calculator", category: "calculator-tools",
    title: "Free Zakat Calculator Online",
    description: "Calculate zakat at 2.5% on cash, savings, gold, silver, investments and business stock minus debts, checked against the silver nisab. Religious estimate only.",
    keywords: "zakat calculator, calculate zakat, zakat nisab, zakat on gold, zakat 2.5 percent",
    howTo: ["Enter your cash, savings, gold and silver values.", "Add investments and business stock.", "Subtract the debts you owe.", "Enter today's silver rate per gram and click Calculate Zakat."],
    formats: "Amounts in rupees. Formula: zakat = 2.5% × (cash + savings + gold + silver + investments + business stock − debts), payable when net wealth reaches the nisab — the value of 52.5 tola (612.36 g) of silver.",
    examples: ["Cash 500,000 + savings 100,000 + gold 200,000 − debts 50,000 = net wealth 750,000. At Rs 450 per gram of silver the nisab is Rs 275,562, so zakat is Rs 18,750.", "Net wealth below the nisab → no zakat is due on that calculation."],
    faqs: [
      { q: "How is zakat calculated?", a: "Zakat is 2.5% of net zakatable wealth held for a full lunar year — cash, bank savings, gold, silver, investments and business stock, minus debts. For example, net wealth of 750,000 gives zakat of 18,750." },
      { q: "What is the nisab?", a: "The minimum wealth above which zakat is due: the value of 52.5 tola (612.36 grams) of silver, or 7.5 tola of gold. This calculator checks the silver nisab using the silver rate you enter." },
      { q: "Why do I have to enter the silver rate myself?", a: "Silver prices change daily and this tool has no live price feed, so you enter today's rate per gram. The nisab is then 612.36 × that rate." },
      { q: "Is zakat due on my house or car?", a: "No — zakat is not due on personal items you use, such as your home or car. It is due on wealth held for a year: cash, savings, gold, silver, trade goods, investments and business stock." },
      { q: "Is this a fatwa?", a: "No. This is a calculation aid only, not a religious ruling. If you are unsure — for example about business stock or debts — ask a scholar." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["gold-value-calculator", "pakistan-salary-tax-calculator", "percentage-calculator", "compound-interest-calculator"]
  },
  {
    slug: "gold-value-calculator", name: "Gold Value Calculator", category: "calculator-tools",
    title: "Free Gold Value Calculator Online",
    description: "Work out what your gold is worth — enter weight in tola, grams, masha or ratti, pick the karat, and enter today's per-tola rate. No live price is built in.",
    keywords: "gold value calculator, gold price tola, gold rate calculator, tola to gram, gold karat calculator",
    howTo: ["Enter the gold weight and pick tola, gram, masha or ratti.", "Pick the karat (24, 22, 21 or 18).", "Enter today's 24K rate per tola from your sarafa market.", "Click Calculate Gold Value."],
    formats: "Weight and a rate you enter. Formula: value = weight in tola × per-tola 24K rate × (karat ÷ 24). 1 tola = 11.664 grams = 12 masha = 96 ratti.",
    examples: ["2 tola of 22K gold at Rs 400,000 per tola (24K) → 2 × 400,000 × (22 ÷ 24) = Rs 733,333.33.", "1 tola of 24K gold at Rs 400,000 per tola → Rs 400,000."],
    faqs: [
      { q: "How is gold value calculated?", a: "Weight in tola × the per-tola 24K rate × (karat ÷ 24). For example, 2 tola of 22K gold at Rs 400,000 a tola is 2 × 400,000 × 22/24 = Rs 733,333.33." },
      { q: "How many grams are in a tola?", a: "One tola is 11.664 grams. One tola is also 12 masha, and one masha is 8 ratti, so one tola is 96 ratti." },
      { q: "Why do I have to enter the gold rate myself?", a: "Gold prices change daily and this tool has no live price feed. Enter today's 24K per-tola rate from your local sarafa market for an up-to-date value." },
      { q: "Does the result include making charges?", a: "No. Making charges are added by jewellers when you buy, and are not part of the metal value this calculator works out." },
      { q: "What is the difference between 22K and 24K?", a: "24K is pure gold. 22K is 22 parts gold out of 24 (about 91.7% pure), so it is worth 22/24 of the 24K price for the same weight." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["zakat-calculator", "unit-converter", "percentage-calculator", "pakistan-salary-tax-calculator"]
  },
  {
    slug: "pakistan-salary-tax-calculator", name: "Pakistan Salary Tax Calculator", category: "calculator-tools",
    title: "Free Pakistan Salary Tax Calculator",
    description: "Work out FBR income tax on a Pakistani salary for tax year 2026–27 — monthly tax, take-home pay and a slab-by-slab breakdown. Estimate only.",
    keywords: "pakistan salary tax calculator, fbr income tax calculator, salary tax pakistan 2026-27, take home salary pakistan, income tax slabs pakistan",
    howTo: ["Enter your annual salary in rupees.", "Click Calculate Salary Tax.", "Read the annual and monthly tax, take-home pay and slab breakdown."],
    formats: "One salary figure. FBR salaried slabs for tax year 2026–27 (Finance Act 2026): 0% to Rs 600,000; 1% to Rs 1.2M; 11% to Rs 2.2M; 20% to Rs 3.2M; 25% to Rs 4.1M; 29% to Rs 5.6M; 32% to Rs 7M; 35% above; no surcharge in 2026–27.",
    examples: ["Rs 1,800,000 a year → Rs 72,000 tax a year (Rs 6,000 a month), take-home Rs 144,000 a month.", "Rs 900,000 a year → Rs 3,000 tax a year (Rs 250 a month)."],
    faqs: [
      { q: "How is salary tax calculated in Pakistan?", a: "With progressive slabs: each part of your salary is taxed at its slab's rate. For example, Rs 1,800,000 a year is Rs 600,000 tax-free, Rs 600,000 at 1% (Rs 6,000) and Rs 600,000 at 11% (Rs 66,000) — Rs 72,000 a year in total." },
      { q: "What are the FBR salary tax slabs for 2026–27?", a: "0% up to Rs 600,000; 1% to Rs 1.2M; 11% to Rs 2.2M; 20% to Rs 3.2M; 25% to Rs 4.1M; 29% to Rs 5.6M; 32% to Rs 7M; and 35% above Rs 7M, with no surcharge in 2026–27, under the Finance Act 2026." },
      { q: "Is this my exact tax?", a: "No, it is an estimate. Allowances, rebates and filer status can change your final FBR liability. Verify on fbr.gov.pk or ask a tax practitioner." },
      { q: "Does this include EOBI or provident fund?", a: "No. This calculator only works out income tax on salary. EOBI, provident fund and other deductions are not included." },
      { q: "What is take-home pay?", a: "Your salary minus income tax — what actually lands in your account. For Rs 1,800,000 a year, monthly take-home is Rs 150,000 minus Rs 6,000 tax = Rs 144,000." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["zakat-calculator", "salary-to-hourly-calculator", "percentage-calculator", "compound-interest-calculator"]
  },
  {
    slug: "pakistan-electricity-bill-calculator", name: "Pakistan Electricity Bill Calculator", category: "calculator-tools",
    title: "Free Pakistan Electricity Bill Calculator",
    description: "Estimate your Pakistani electricity bill from units used — NEPRA residential slabs for protected and non-protected users, with every rate editable. Estimate only.",
    keywords: "pakistan electricity bill calculator, lesco bill calculator, nepra slab rates, bijli bill calculator, k-electric bill calculator",
    howTo: ["Enter the units used this month.", "Pick protected or non-protected.", "Check the slab rates against your latest bill and edit any that changed.", "Enter fuel adjustment, fixed charges and GST from your bill, then click Calculate."],
    formats: "Units plus editable rates. Default slab rates are the July 2025 NEPRA notified residential base rates: protected 10.54 (1–100) and 13.01 (101–200); non-protected 22.44, 28.91, 33.10, 37.99, 40.20, 41.62, 42.76 and 47.69 per unit. Slabs are added one by one.",
    examples: ["300 units, non-protected, at the July 2025 rates → 100 × 22.44 + 100 × 28.91 + 100 × 33.10 = Rs 8,445 energy charges, before fuel adjustment and taxes.", "150 units, protected → 100 × 10.54 + 50 × 13.01 = Rs 1,704.50 energy charges."],
    faqs: [
      { q: "How is my electricity bill estimated?", a: "Units in each slab are multiplied by that slab's rate and added up. For example, 300 non-protected units at the July 2025 rates is 100 × 22.44 + 100 × 28.91 + 100 × 33.10 = Rs 8,445 energy charges, before fuel adjustment, fixed charges and taxes." },
      { q: "What is the difference between protected and non-protected?", a: "Protected users used 200 units or fewer in each of the last six months and pay the two cheap slabs (10.54 and 13.01 per unit in July 2025). Everyone else is non-protected and pays the higher slabs." },
      { q: "Are the rates up to date?", a: "The defaults are the July 2025 NEPRA notified rates. Tariffs, fuel adjustment and taxes change — often monthly — so every rate field is editable: copy the rates from your latest bill for an accurate estimate." },
      { q: "Why is my real bill higher than this estimate?", a: "The estimate only adds what you enter. Real bills also include fuel price adjustment, quarterly adjustments, fixed charges, GST, electricity duty and other surcharges — enter those from your bill." },
      { q: "Which DISCOs does this cover?", a: "The NEPRA residential slabs apply across DISCOs including LESCO, IESCO, FESCO, MEPCO, PESCO and K-Electric, but exact charges vary — always match the rates to your own bill." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["pakistan-salary-tax-calculator", "percentage-calculator", "unit-converter", "fuel-cost-calculator"]
  },
  {
    slug: "mortgage-calculator", name: "Mortgage Calculator", category: "calculator-tools",
    title: "Free Mortgage Calculator Online",
    description: "Work out your monthly mortgage payment from home price, down payment, interest rate and tenure — with total interest and total payment. Estimate only.",
    keywords: "mortgage calculator, home loan calculator, monthly mortgage payment, house loan calculator, mortgage payment calculator",
    howTo: ["Enter the home price.", "Enter your down payment.", "Enter the annual interest rate and the tenure in years.", "Click Calculate Mortgage."],
    formats: "Numbers only. Formula: payment = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is the loan amount (price − down payment), r the monthly rate and n the tenure in months.",
    examples: ["A 10,000,000 home with a 2,000,000 down payment, 12% interest over 20 years → monthly payment about 88,086.89, total interest about 13,140,853.76.", "A bigger down payment shrinks the loan and the monthly payment."],
    faqs: [
      { q: "How is a mortgage payment calculated?", a: "From the loan amount (home price minus down payment) with the standard EMI formula. For example, an 8,000,000 loan at 12% over 20 years (240 months) gives a monthly payment of about 88,086.89." },
      { q: "What is the difference between this and the Loan EMI Calculator?", a: "The maths is the same, but this one is built for buying a home: you enter the home price and down payment, and it works out the loan from those. The Loan EMI Calculator starts from the loan amount itself." },
      { q: "Does a bigger down payment help?", a: "Yes — a bigger down payment means a smaller loan, a smaller monthly payment and less total interest over the life of the loan." },
      { q: "Does this include taxes or insurance?", a: "No. Real mortgage bills may also include property tax, insurance and fees, which this calculator does not include." },
      { q: "Is this an exact mortgage payment?", a: "No, it is an estimate. The lender's exact rate, fees and schedule decide the real payment." },
      { q: "Is this financial advice?", a: "No. This calculator gives an estimate only and is not financial advice." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["loan-emi-calculator", "compound-interest-calculator", "percentage-calculator", "sip-calculator"]
  },
  {
    slug: "salary-to-hourly-calculator", name: "Salary to Hourly Calculator", category: "calculator-tools",
    title: "Free Salary to Hourly Calculator",
    description: "Convert an annual salary to an hourly rate, or an hourly rate to an annual salary — with monthly and weekly pay. Free, instant, private.",
    keywords: "salary to hourly calculator, hourly to salary calculator, hourly rate calculator, annual salary to hourly, salary per hour",
    howTo: ["Pick the direction: salary to hourly, or hourly to salary.", "Enter the salary or hourly rate.", "Enter hours per week and weeks per year.", "Click Calculate."],
    formats: "Numbers only. Formulas: hourly rate = annual salary ÷ (hours per week × weeks per year); annual salary = hourly rate × hours per week × weeks per year.",
    examples: ["1,200,000 a year at 40 hours a week for 52 weeks → 576.92 an hour.", "500 an hour at 40 hours a week for 52 weeks → 1,040,000 a year."],
    faqs: [
      { q: "How do I convert salary to an hourly rate?", a: "Divide the annual salary by hours per week times weeks per year. For example, 1,200,000 a year at 40 hours a week for 52 weeks is 1,200,000 ÷ 2,080 = 576.92 an hour." },
      { q: "How do I convert an hourly rate to a salary?", a: "Multiply the hourly rate by hours per week and weeks per year. For example, 500 an hour at 40 hours a week for 52 weeks is 500 × 2,080 = 1,040,000 a year." },
      { q: "Is this my take-home pay?", a: "No. The result is gross pay before tax and deductions, and it assumes the same hours every week." },
      { q: "What if I work fewer weeks a year?", a: "Change the weeks per year — for example 48 weeks for a month of unpaid leave — and the hourly rate rises, because the same salary is spread over fewer hours." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["pakistan-salary-tax-calculator", "percentage-calculator", "compound-interest-calculator", "unit-converter"]
  },
  {
    slug: "discount-calculator", name: "Discount Calculator", category: "calculator-tools",
    title: "Free Discount Calculator Online",
    description: "Work out a sale price from a discount %, or the discount % from before and after prices — with the amount saved. Free, instant, private.",
    keywords: "discount calculator, sale price calculator, percent off calculator, calculate discount, price after discount",
    howTo: ["Pick what to work out: price after a discount %, or discount % from two prices.", "Enter the original price.", "Enter the discount % or the sale price.", "Click Calculate Discount."],
    formats: "Numbers only. Formulas: discount = price × (discount % ÷ 100); final price = price − discount; discount % = ((original − sale) ÷ original) × 100.",
    examples: ["5,000 with 20% off → you save 1,000 and pay 4,000.", "5,000 down to 4,000 is a 20% discount."],
    faqs: [
      { q: "How do I calculate a discount?", a: "Multiply the price by the discount percentage divided by 100. For example, 20% off 5,000 is 5,000 × 0.20 = 1,000 saved, so you pay 4,000." },
      { q: "How do I work out the discount % from two prices?", a: "Subtract the sale price from the original price, divide by the original price and multiply by 100. For example, 5,000 down to 4,000 is ((5,000 − 4,000) ÷ 5,000) × 100 = 20%." },
      { q: "What is the price after two discounts?", a: "Apply them one after the other, not added together. For example, 20% off then 10% off 5,000 is 5,000 × 0.80 × 0.90 = 4,000 — a 28% total discount, not 30%." },
      { q: "Does this include tax?", a: "No. This calculator works on the price alone — taxes or extra fees are not included." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["percentage-calculator", "salary-to-hourly-calculator", "unit-converter", "compound-interest-calculator"]
  },
  {
    slug: "sip-calculator", name: "SIP Calculator", category: "calculator-tools",
    title: "Free SIP Calculator Online",
    description: "Estimate how a monthly SIP (systematic investment plan) grows — future value, total invested and estimated gains at your expected return. Estimate only.",
    keywords: "sip calculator, monthly investment calculator, sip returns calculator, systematic investment plan calculator, sip future value",
    howTo: ["Enter your monthly investment.", "Enter the expected annual return.", "Enter the years.", "Click Calculate SIP Growth."],
    formats: "Numbers only. Formula: FV = P × (((1+i)^n − 1) ÷ i) × (1+i), where P is the monthly investment, i the monthly return (annual rate ÷ 12) and n the months.",
    examples: ["10,000 a month at an expected 12% a year for 10 years → about 2,323,390.76, of which 1,200,000 was invested.", "5,000 a month at 10% a year for 5 years → about 390,411.91, of which 300,000 was invested."],
    faqs: [
      { q: "How is SIP growth calculated?", a: "Each monthly investment is assumed to compound at the monthly return. For example, 10,000 a month at 12% a year for 10 years (120 months) grows to about 2,323,390.76." },
      { q: "What is a SIP?", a: "A systematic investment plan — a fixed amount invested every month, usually into a mutual fund. Regular investing spreads purchases over time instead of one lump sum." },
      { q: "Are the returns guaranteed?", a: "No. The result assumes a fixed expected return, but real investments go up and down. The return you enter is only an assumption — try a lower rate too." },
      { q: "Does this include taxes or fees?", a: "No. Taxes and fund fees are not included, so the real amount you keep can be lower." },
      { q: "What is the difference between invested and gains?", a: "Invested is what you put in (monthly amount × months). Gains are the growth on top — future value minus invested. For 10,000 a month over 10 years, invested is 1,200,000 and estimated gains are about 1,123,390.76." },
      { q: "Is this financial advice?", a: "No. This calculator gives an estimate only and is not financial advice." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["compound-interest-calculator", "loan-emi-calculator", "percentage-calculator", "mortgage-calculator"]
  },
  {
    slug: "pregnancy-due-date-calculator", name: "Pregnancy Due Date Calculator", category: "calculator-tools",
    title: "Free Pregnancy Due Date Calculator",
    description: "Estimate your due date from the first day of your last menstrual period — plus how many weeks pregnant you are today. Estimate only, not medical advice.",
    keywords: "pregnancy calculator, due date calculator, pregnancy due date, edd calculator, how many weeks pregnant",
    howTo: ["Pick the first day of your last menstrual period.", "Click Calculate Due Date.", "Read the estimated due date and your current week."],
    formats: "One date. Formula: due date = first day of the last menstrual period + 280 days (40 weeks).",
    examples: ["Last menstrual period starting 1 January 2026 → estimated due date 8 October 2026.", "A period starting 1 March 2026 → estimated due date 6 December 2026."],
    faqs: [
      { q: "How is the due date calculated?", a: "By adding 280 days (40 weeks) to the first day of your last menstrual period. For example, 1 January 2026 + 280 days = 8 October 2026." },
      { q: "How many weeks pregnant am I?", a: "Count full weeks from the first day of your last menstrual period to today. This calculator shows that alongside the due date." },
      { q: "Is the due date exact?", a: "No. It is an estimate — most babies arrive within about two weeks either side of the due date. Only a doctor or an ultrasound can confirm it." },
      { q: "What if my cycles are irregular?", a: "Then this estimate is less reliable, because the calculation assumes a typical 28-day cycle. An ultrasound gives a better date." },
      { q: "Is this medical advice?", a: "No. This calculator gives an estimate only and is not medical advice. See a doctor for pregnancy care." },
      { q: "Does this tool use AI?", a: "No. It is a plain date calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and your dates are never sent to a server or stored." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["age-calculator", "calorie-calculator", "daily-water-intake-calculator", "time-zone-converter"]
  },
  {
    slug: "time-zone-converter", name: "Time Zone Converter", category: "calculator-tools",
    title: "Free Time Zone Converter Online",
    description: "Convert a date and time between time zones — Karachi, UTC, London, New York and more — with daylight saving handled. Free, instant, private.",
    keywords: "time zone converter, convert time zone, karachi to utc, pakistan time converter, world time converter",
    howTo: ["Pick a date and time.", "Pick the from time zone.", "Pick the to time zone.", "Click Convert Time Zone."],
    formats: "A date, a time and two IANA time zones. Conversion uses your browser's built-in time-zone data, so daylight saving is handled for the date you enter.",
    examples: ["15 January 2026, 12:00 in Karachi → 07:00 UTC, and 02:00 the same day in New York.", "15 January 2026, 09:30 in New York → 14:30 UTC, and 19:30 in Karachi."],
    faqs: [
      { q: "How does the conversion work?", a: "Your browser holds the IANA time-zone database, so the tool converts the moment exactly, including daylight saving for the date you enter. No offset is typed in by hand." },
      { q: "What time is it in Karachi when it is noon in London?", a: "It depends on the date, because London uses daylight saving. Enter the date here — for example, 15 January 2026 at 12:00 in London is 17:00 in Karachi." },
      { q: "Why does the same time convert differently in summer and winter?", a: "Because some zones move their clocks for daylight saving. New York is 5 hours behind UTC in winter (EST) and 4 hours behind in summer (EDT), so the same Karachi time lands an hour apart." },
      { q: "Which time zones are included?", a: "UTC, Karachi, Dubai, Kolkata, Dhaka, Singapore, Tokyo, Sydney, London, Berlin, New York, Chicago, Los Angeles and Toronto." },
      { q: "Does this tool use AI?", a: "No. It is a plain date calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The conversion runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["age-calculator", "pregnancy-due-date-calculator", "unit-converter", "word-counter"]
  },
  {
    slug: "daily-water-intake-calculator", name: "Daily Water Intake Calculator", category: "calculator-tools",
    title: "Free Daily Water Intake Calculator",
    description: "Estimate how much water to drink each day from your weight and activity level — in litres and glasses. Estimate only, not medical advice.",
    keywords: "water intake calculator, how much water per day, daily water calculator, water drinking calculator, hydration calculator",
    howTo: ["Enter your weight in kg or pounds.", "Pick your activity level.", "Click Calculate Water Intake.", "Read the litres per day and the number of glasses."],
    formats: "Weight and activity. Formula: litres per day = weight in kg × ml per kg (30 for low, 35 for moderate, 40 for high activity), divided by 1000. One glass is 250 ml.",
    examples: ["70 kg at moderate activity → 70 × 35 ml = 2.45 litres a day, about 10 glasses.", "80 kg at high activity → 80 × 40 ml = 3.20 litres a day."],
    faqs: [
      { q: "How much water should I drink a day?", a: "A common guide is about 30–40 ml per kilogram of body weight. For example, 70 kg at moderate activity is 70 × 35 ml = 2.45 litres a day, about 10 glasses of 250 ml." },
      { q: "Does food count towards water intake?", a: "Yes — food, especially fruit, vegetables and soups, adds water. This calculator estimates drinking water only, so your total fluid intake is higher." },
      { q: "Do I need more water in hot weather or when exercising?", a: "Yes. Pick high activity for hot weather or heavy exercise — the guide rises to about 40 ml per kilogram." },
      { q: "Can I drink too much water?", a: "Yes, although it is uncommon. Do not force large amounts beyond thirst, and ask a doctor if you have a condition that limits fluids, such as kidney or heart disease." },
      { q: "Is this medical advice?", a: "No. This calculator gives an estimate only and is not medical advice." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["calorie-calculator", "bmi-calculator", "age-calculator", "fuel-cost-calculator"]
  },
  {
    slug: "fuel-cost-calculator", name: "Fuel Cost Calculator", category: "calculator-tools",
    title: "Free Fuel Cost Calculator Online",
    description: "Work out fuel cost for a trip — enter distance, your vehicle's mileage and today's fuel price per litre. No live price is built in.",
    keywords: "fuel cost calculator, petrol cost calculator, trip fuel calculator, fuel price calculator, car fuel cost per km",
    howTo: ["Enter the trip distance in kilometres.", "Enter your vehicle's mileage in km per litre.", "Enter today's fuel price per litre.", "Click Calculate Fuel Cost."],
    formats: "Distance, mileage and a price you enter. Formulas: fuel = distance ÷ mileage; cost = fuel × price per litre; cost per km = cost ÷ distance.",
    examples: ["300 km at 15 km per litre → 20 litres. At Rs 250 a litre that costs Rs 5,000, or Rs 16.67 per kilometre.", "150 km at 10 km per litre → 15 litres."],
    faqs: [
      { q: "How is fuel cost calculated?", a: "Fuel needed is distance divided by mileage, and cost is fuel times the price per litre. For example, 300 km at 15 km per litre needs 20 litres; at Rs 250 a litre that is Rs 5,000." },
      { q: "Why do I have to enter the fuel price myself?", a: "Fuel prices change often and this tool has no live price feed. Enter today's price per litre from your nearest petrol pump." },
      { q: "How do I find my vehicle's mileage?", a: "Fill the tank, note the odometer, drive, then refill and divide the kilometres driven by the litres used. City driving usually gives lower mileage than highway driving." },
      { q: "What is the cost per kilometre?", a: "Total fuel cost divided by distance — a handy way to compare vehicles. For the example above it is Rs 5,000 ÷ 300 km = Rs 16.67 per kilometre." },
      { q: "Does this include tolls?", a: "No. Only fuel is counted — tolls, parking and other trip costs are not included." },
      { q: "Does this tool use AI?", a: "No. It is a plain calculation in your browser, not AI." },
      { q: "Is my data uploaded or stored?", a: "No. The calculation runs locally in your browser and nothing is sent to a server." },
      { q: "Is it free?", a: "Yes, free with no sign-up." }
    ],
    related: ["unit-converter", "percentage-calculator", "daily-water-intake-calculator", "pakistan-electricity-bill-calculator"]
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
