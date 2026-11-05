# SEO Guidelines

- One URL per tool; unique title/description/canonical per page; one H1.
- Never add fake reviews, ratings, prices or FAQs to structured data.
- JSON-LD only where it matches visible content: WebSite + Organization on
  home; WebApplication + BreadcrumbList on tool pages; Article on blog posts.
- Sitemap is generated from the route registry (`npm run sitemap`); never
  hand-edit `public/sitemap.xml` — regenerate it. Sitemap priority and
  changefreq are metadata, not ranking boosts.
- robots.txt disallows `/seo/ /admin/ /api/ /login/ /auth/` — but robots.txt
  is not access control: private pages must also be auth-protected + noindex.
- Every tool page needs real content: how-to, formats/limits, examples,
  FAQs, related tools. No near-empty tool pages.
- Internal links: each tool page links to its category, 2–4 related tools
  and a relevant article. No mass unrelated linking.
- AEO: answer the main question early, use real question headings, keep
  answers in crawlable HTML (not hidden behind JS-only controls).
- GSO: internal diagnostic weights only (answer completeness 20, factual
  support 15, original info 15, clarity 10, coverage 10, structure 10,
  entity clarity 5, crawlability 10, freshness 5). No guarantee of AI
  Overview inclusion; Google guidance is foundational SEO + helpful content.
- Performance targets: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Lazy-load heavy
  libraries (Pica, browser-image-compression load on demand).
- Do not create duplicate country pages (one global site).
