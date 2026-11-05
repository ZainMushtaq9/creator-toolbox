// Workflows (strategy). Only the YouTube workflow has full multi-step
// shared state in Stage 1; the others are index cards linking to tools.
export const WORKFLOWS = [
  { slug: "youtube-creator", name: "YouTube Creator Workflow", audience: "YouTubers", description: "One topic, carried through title → description → tags & hashtags → thumbnail → quality check. Full multi-step workflow in Stage 1.", full: true },
  { slug: "instagram-creator", name: "Instagram Creator Workflow", audience: "Instagram creators", description: "Bio → caption → hashtags → post size → engagement check.", full: false, tools: ["instagram-bio-generator", "instagram-caption-generator", "instagram-hashtag-generator", "instagram-post-size-calculator", "instagram-engagement-calculator"] },
  { slug: "blogger", name: "Blogger Workflow", audience: "Bloggers", description: "Draft → word count → headline → images optimised → publish.", full: false, tools: ["word-counter", "youtube-title-generator", "image-compressor", "image-resizer"] },
  { slug: "developer", name: "Developer Workflow", audience: "Developers", description: "Text conversion → counts → ratios → compressed screenshots.", full: false, tools: ["text-case-converter", "word-counter", "video-aspect-ratio-calculator", "image-compressor"] },
  { slug: "student", name: "Student Workflow", audience: "Students", description: "Essay draft → word count → formatting → images → submit.", full: false, tools: ["word-counter", "text-case-converter", "image-compressor"] },
  { slug: "small-business", name: "Small Business Workflow", audience: "Small businesses", description: "Bio → weekly captions → hashtags → product photos.", full: false, tools: ["instagram-bio-generator", "instagram-caption-generator", "instagram-hashtag-generator", "image-compressor"] },
  { slug: "website-owner", name: "Website Owner Workflow", audience: "Website owners", description: "Images optimised → text checked → ratios verified → launch.", full: false, tools: ["image-compressor", "image-resizer", "jpg-to-png-converter", "word-counter", "video-aspect-ratio-calculator"] }
];
export const getWorkflow = (slug) => WORKFLOWS.find((w) => w.slug === slug);
