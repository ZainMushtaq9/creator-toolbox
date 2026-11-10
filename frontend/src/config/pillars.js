// Five pillars (strategy). They GROUP the Stage-1 tools (21 at launch) and
// the roadmap; they are not separate products. Twenty calculator tools from
// the roadmap (percentage, age, BMI, loan/EMI, unit converter, compound
// interest, calorie, CGPA, zakat, gold value, Pakistan salary tax, Pakistan
// electricity bill, mortgage, salary-to-hourly, discount, SIP, pregnancy due
// date, time zone, daily water intake, fuel cost) were built after Stage 1
// and join the productivity pillar below.
export const PILLARS = [
  { slug: "creator-tools", name: "Creator Tools", icon: "Clapperboard", description: "Titles, captions, hashtags, hooks and earnings for YouTube, Instagram and TikTok.", tools: ["youtube-title-generator", "youtube-description-generator", "youtube-hashtag-generator", "youtube-tag-generator", "youtube-shorts-title-generator", "instagram-caption-generator", "instagram-hashtag-generator", "instagram-bio-generator", "tiktok-hook-generator", "tiktok-caption-generator", "tiktok-hashtag-generator"] },
  { slug: "file-media-tools", name: "File and Media Tools", icon: "Image", description: "Images resized, compressed and converted in your browser — nothing uploaded.", tools: ["image-compressor", "image-resizer", "jpg-to-png-converter", "youtube-thumbnail-resizer"] },
  { slug: "productivity-developer-tools", name: "Productivity and Developer Tools", icon: "Code2", description: "Word counts, case conversion and calculations that save minutes every day.", tools: ["word-counter", "text-case-converter", "video-aspect-ratio-calculator", "instagram-post-size-calculator", "instagram-engagement-calculator", "youtube-earnings-calculator", "percentage-calculator", "age-calculator", "bmi-calculator", "loan-emi-calculator", "unit-converter", "compound-interest-calculator", "calorie-calculator", "cgpa-calculator", "zakat-calculator", "gold-value-calculator", "pakistan-salary-tax-calculator", "pakistan-electricity-bill-calculator", "mortgage-calculator", "salary-to-hourly-calculator", "discount-calculator", "sip-calculator", "pregnancy-due-date-calculator", "time-zone-converter", "daily-water-intake-calculator", "fuel-cost-calculator"] },
  { slug: "seo-intelligence", name: "SEO Intelligence", icon: "Search", description: "The later advanced product: keyword research, audits, competitor analysis and Search Console. Owner-only dashboard is a stub in Stage 1.", tools: [] },
  { slug: "ai-productivity", name: "AI Productivity", icon: "Sparkles", description: "AI-powered helpers, honestly labelled. Stage-1 generators use templates, not AI; AI features arrive with the backend in a later stage.", tools: [] }
];
export const getPillar = (slug) => PILLARS.find((p) => p.slug === slug);
