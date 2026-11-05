# CreatorToolbox Blueprint (summarised)

Summary of the full development blueprint supplied by the user (2026-11-05).
The blueprint is the specification; this repo implements Deliverable A / M1
(Phases 1–3) plus launch-ready SEO basics and a backend skeleton. It is NOT a
claim that the whole blueprint is implemented — see `docs/ROADMAP.md`.

## Stack

React 18 + Vite, JavaScript ES Modules, CSS3, React Router, lucide-react,
zod, recharts (dashboard stub only), react-helmet-async. Backend: Cloudflare
Workers + D1 (+ optional R2). AI: NVIDIA Build (task-specific models, names
configurable, never hardcoded). Auth: Google OAuth 2.0 (Search Console,
read-only scope). Analytics: GA4. Monetization: AdSense. Hosting: Cloudflare
Pages. VCS: GitHub. Free-first: no paid APIs, subscriptions or paid hosting
in the initial architecture.

## Architecture rule

Simple tools run in the browser. The backend is only for secrets, persistent
data, Google APIs, external crawling or AI inference.

## Deliverables

- **A — Public website**: homepage, 21 tools, individual SEO pages, blog,
  legal pages, sitemap + robots, GA4/AdSense preparation. (This build.)
- **B — SEO Intelligence backend**: Worker, D1, keyword research, competitor
  analysis, page audit, NVIDIA AI, Search Console, AEO/GSO reports. (Later.)
- **C — Growth and monetization**: Search Console monitoring, content
  workflow, SEO dashboard, AdSense, revenue analytics, performance monitoring.
  (Later.)

## 21 MVP tools

YouTube (8): title, description, hashtag, tag, thumbnail resizer (1280×720),
aspect-ratio calculator, earnings calculator (RPM estimate), Shorts titles.
Instagram (5): caption, hashtag, bio, post-size calculator, engagement calculator.
TikTok (3): hook, caption, hashtag. Image (3): compressor, resizer, JPG→PNG.
Text (2): word counter, text case converter.

Quality rules: template generators disclose they are not AI; calculators show
formulas and estimate disclaimers; thumbnail output is exactly 1280×720;
compression preserves transparency where the format allows.

## SEO / AEO / GSO

One URL per tool, unique title/description/canonical, one H1, internal links,
JSON-LD (WebSite, Organization, WebApplication, BreadcrumbList — only where
accurate, no fake reviews/ratings), generated sitemap, robots.txt, answer-first
content, GSO diagnostic scoring (internal weights, not Google signals).
No model can guarantee inclusion in AI Overviews.

## Security (backend)

HTTP/HTTPS only, reject localhost/private IPs/metadata, recheck redirects,
limit size/time/pages, respect robots/terms, never execute competitor JS,
never expose secrets. Admin routes protected. Tokens encrypted (Web Crypto).

## Roadmap order

1 Frontend foundation → 2 21 tools → 3 SEO foundation → 4 backend →
5 SEO Intelligence → 6 AI → 7 Google integration → 8 monetization/launch.
