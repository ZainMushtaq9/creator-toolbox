// Prerender static HTML for every public route, so a static host
// (GitHub Pages) serves HTTP 200 with route-correct SEO instead of the
// SPA 404 fallback (404.html serves the app shell with a 404 status,
// which Googlebot refuses to index).
//
// Run after `vite build` (the frontend `build` script chains it):
//   npm --prefix frontend run prerender
// or directly: node scripts/prerender.mjs [outDir]
//   outDir defaults to frontend/dist. The asset base (e.g.
//   /creator-toolbox/ on GitHub Pages) is detected from the built
//   dist/index.html, falling back to $PAGES_BASE_PATH, then "/".
//
// For each route in frontend/public/route-manifest.json (the same list
// the sitemap is generated from) it writes:
//   <outDir>/<route>/index.html   — the directory index (301 -> 200 path)
//   <outDir>/<route>.html         — a twin so the exact extensionless
//                                   sitemap URL also returns 200 directly
// Route "/" overwrites <outDir>/index.html in place. Both files are the
// built shell with route-correct <title>, meta description, canonical,
// OG tags and JSON-LD, plus a static H1 + lede + links inside #root so
// crawlers see real content without JavaScript. The React app still
// mounts normally in a browser (main.jsx uses createRoot, which replaces
// the static content). Running the script twice is safe: previously
// inserted tags are stripped before re-inserting.
//
// Metadata comes from the same sources the React pages use, read fresh
// at runtime: frontend/src/config/tools.js (tools, categories),
// collections.js, blog.js, seo.js and site.js. Static pages (home,
// tools index, workflows, collections index, blog index, about,
// contact, legal) mirror the SeoHead props in their page components;
// legal intros are copied from frontend/src/pages/Legal.jsx — if a
// legal page changes there, update STATIC_PAGES here too.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { SITE_URL, SITE_NAME } from "../frontend/src/config/site.js";
import {
  TOOLS,
  CATEGORIES,
  publicPages,
  getTool,
  getCategory,
  toolsByCategory,
} from "../frontend/src/config/tools.js";
import { COLLECTIONS, getCollection } from "../frontend/src/config/collections.js";
import { ARTICLES, getArticle } from "../frontend/src/config/blog.js";
import {
  pageMeta,
  webAppJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "../frontend/src/config/seo.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(process.argv[2] || join(root, "frontend/dist"));

// Static pages: values mirror the <SeoHead> props and <h1> in each page
// component (frontend/src/pages/*.jsx). Keep in sync with those files.
const STATIC_PAGES = {
  "/": {
    title: "Free Online Tools",
    description:
      "Free online tools and AI-powered productivity for everyone. Create, optimize, convert and grow — YouTube, Instagram, TikTok, image and text tools that run in your browser.",
    h1: "Create. Optimize. Convert. Grow.",
    lede: "CreatorToolbox is a free collection of 21 online tools for YouTube, Instagram, TikTok, images and text — free with no sign-up, running in your browser so nothing is uploaded.",
  },
  "/tools": {
    title: "All Free Tools",
    description:
      "Browse all 21 free CreatorToolbox tools — YouTube, Instagram, TikTok, image and text tools that run in your browser.",
    h1: "All Tools",
    lede: "Browse all 21 free CreatorToolbox tools — YouTube, Instagram, TikTok, image and text tools that run in your browser.",
  },
  "/workflows": {
    title: "Workflows — Connected Tool Sequences",
    description:
      "Step-by-step workflows that carry one topic through several CreatorToolbox tools — YouTube, Instagram, blogging, development, study and small business.",
    h1: "Workflows",
    lede: "Step-by-step workflows that carry one topic through several CreatorToolbox tools.",
  },
  "/workflows/youtube-creator": {
    title: "YouTube Creator Workflow",
    description:
      "One topic carried through title, description, tags and hashtags, thumbnail and a final quality check — then saved to your workspace.",
    h1: "YouTube Creator Workflow",
    lede: "One topic carried through title, description, tags and hashtags, thumbnail and a final quality check — then saved to your workspace.",
  },
  "/workspaces": {
    title: "Workspaces — Save Your Work",
    description:
      "Save generated results into projects on your own device. No signup, no account sync — browser local storage only.",
    h1: "Workspaces",
    lede: "Save generated results into projects on your own device. No signup, no account sync — browser local storage only.",
  },
  "/collections": {
    title: "Tool Collections — Curated Kits",
    description:
      "Curated tool kits for one job: YouTube Starter, Instagram Growth, Blogger SEO, Website Launch, Developer Starter, Image Optimization, Student Productivity and Small Business.",
    h1: "Collections",
    lede: "Curated tool kits for one job: YouTube Starter, Instagram Growth, Blogger SEO, Website Launch, Developer Starter, Image Optimization, Student Productivity and Small Business.",
  },
  "/blog": {
    title: "Blog — Creator Guides",
    description:
      "Practical guides for creators: image compression, YouTube titles and earnings, Instagram bios and engagement, image sizes and word counts.",
    h1: "Blog",
    lede: "Practical guides for creators: image compression, YouTube titles and earnings, Instagram bios and engagement, image sizes and word counts.",
  },
  "/about": {
    title: "About CreatorToolbox",
    description:
      "CreatorToolbox is a free all-in-one tools platform for content creators and website owners — connected workflows, privacy-first processing, honest AI.",
    h1: "About CreatorToolbox",
    lede: "CreatorToolbox is a free all-in-one tools platform for content creators and website owners — connected workflows, privacy-first processing, honest AI.",
  },
  "/contact": {
    title: "Contact CreatorToolbox",
    description:
      "Contact the CreatorToolbox publisher with feedback, corrections or tool requests.",
    h1: "Contact",
    lede: "Contact the CreatorToolbox publisher with feedback, corrections or tool requests.",
  },
  // Legal intros copied from frontend/src/pages/Legal.jsx (PAGES).
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "CreatorToolbox is designed to collect as little as possible. Most tools run entirely in your browser: your text and images are processed locally and are never uploaded to our servers.",
    h1: "Privacy Policy",
    lede: "CreatorToolbox is designed to collect as little as possible. Most tools run entirely in your browser: your text and images are processed locally and are never uploaded to our servers.",
  },
  "/terms": {
    title: "Terms of Use",
    description:
      "By using CreatorToolbox you agree to these terms. The tools are provided free of charge, as-is, without warranties.",
    h1: "Terms of Use",
    lede: "By using CreatorToolbox you agree to these terms. The tools are provided free of charge, as-is, without warranties.",
  },
  "/disclaimer": {
    title: "Disclaimer",
    description: "CreatorToolbox tools are helpers, not professional advice.",
    h1: "Disclaimer",
    lede: "CreatorToolbox tools are helpers, not professional advice.",
  },
  "/cookie-policy": {
    title: "Cookie Policy",
    description: "This site uses as few cookies as possible.",
    h1: "Cookie Policy",
    lede: "This site uses as few cookies as possible.",
  },
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// base "/creator-toolbox/" + "/tools" -> "/creator-toolbox/tools";
// base "/" + "/tools" -> "/tools".
function withBase(base, path) {
  return `${base.replace(/\/$/, "")}${path}`;
}

function crumbsFor(names) {
  const items = [{ name: "Home", path: "/" }];
  for (const [name, p] of names) items.push({ name, path: p });
  return items;
}

// Returns { title, description, h1, lede, jsonLd, links } for a route,
// mirroring what the React page renders (SeoHead + H1 + lede).
function routeMeta(path) {
  // Tool pages: /tools/<slug>
  if (path.startsWith("/tools/")) {
    const tool = getTool(path.slice("/tools/".length));
    if (!tool) throw new Error(`unknown tool route: ${path}`);
    const cat = getCategory(tool.category);
    const crumbs = crumbsFor([
      ["All Tools", "/tools"],
      [cat.name, cat.path],
      [tool.name, null],
    ]);
    return {
      title: tool.title,
      description: tool.description,
      h1: tool.name,
      lede: tool.description,
      jsonLd: [
        webAppJsonLd(tool),
        breadcrumbJsonLd(crumbs.filter((c) => c.path)),
        faqJsonLd(tool.faqs),
      ],
      links: [
        { href: cat.path, label: cat.name },
        ...(tool.related || [])
          .map(getTool)
          .filter(Boolean)
          .slice(0, 4)
          .map((t) => ({ href: `/tools/${t.slug}`, label: t.name })),
      ],
    };
  }
  // Category pages: /youtube-tools etc.
  const cat = CATEGORIES.find((c) => c.path === path);
  if (cat) {
    return {
      title: cat.name,
      description: cat.description,
      h1: cat.name,
      lede: cat.description,
      jsonLd: [
        breadcrumbJsonLd(
          crumbsFor([
            ["All Tools", "/tools"],
            [cat.name, null],
          ]).filter((c) => c.path),
        ),
      ],
      links: toolsByCategory(cat.slug).map((t) => ({
        href: `/tools/${t.slug}`,
        label: t.name,
      })),
    };
  }
  // Collection pages: /collections/<slug>
  if (path.startsWith("/collections/")) {
    const col = getCollection(path.slice("/collections/".length));
    if (!col) throw new Error(`unknown collection route: ${path}`);
    return {
      title: col.name,
      description: col.description,
      h1: col.name,
      lede: col.description,
      jsonLd: [
        breadcrumbJsonLd(
          crumbsFor([
            ["Collections", "/collections"],
            [col.name, null],
          ]).filter((c) => c.path),
        ),
      ],
      links: (col.tools || [])
        .map(getTool)
        .filter(Boolean)
        .map((t) => ({ href: `/tools/${t.slug}`, label: t.name })),
    };
  }
  // Blog articles: /blog/<slug>
  if (path.startsWith("/blog/")) {
    const article = getArticle(path.slice("/blog/".length));
    if (!article) throw new Error(`unknown article route: ${path}`);
    const tool = getTool(article.tool);
    return {
      title: article.title,
      description: article.description,
      h1: article.title,
      lede: article.description,
      jsonLd: [
        breadcrumbJsonLd(
          crumbsFor([
            ["Blog", "/blog"],
            [article.title, null],
          ]).filter((c) => c.path),
        ),
      ],
      links: [
        { href: "/blog", label: "Blog" },
        ...(tool ? [{ href: `/tools/${tool.slug}`, label: tool.name }] : []),
      ],
    };
  }
  // Static pages (home, indexes, legal).
  const page = STATIC_PAGES[path];
  if (!page) throw new Error(`no metadata for route: ${path}`);
  let links;
  if (path === "/") links = [{ href: "/tools", label: "Browse all 21 free tools" }, { href: "/workflows", label: "See workflows" }];
  else if (path === "/tools") links = CATEGORIES.map((c) => ({ href: c.path, label: c.name }));
  else if (path === "/collections") links = COLLECTIONS.map((c) => ({ href: `/collections/${c.slug}`, label: c.name }));
  else if (path === "/blog") links = ARTICLES.map((a) => ({ href: `/blog/${a.slug}`, label: a.title }));
  else links = [{ href: "/tools", label: "Browse all 21 free tools" }];
  // Homepage keeps the WebSite + Organization JSON-LD already in the
  // shell; the FAQPage block is added client-side by Home.jsx.
  const jsonLd =
    path === "/"
      ? []
      : [
          breadcrumbJsonLd(
            crumbsFor([[page.h1, null]]).filter((c) => c.path),
          ),
        ];
  return { ...page, jsonLd, links };
}

function main() {
  const templatePath = join(outDir, "index.html");
  if (!existsSync(templatePath)) {
    console.error(`template not found: ${templatePath} — run vite build first`);
    process.exit(1);
  }
  const template = readFileSync(templatePath, "utf8");
  if (!/<div id="root">/.test(template) || !/<title>/.test(template)) {
    console.error(`template ${templatePath} does not look like the built shell (no <div id="root"> or <title>)`);
    process.exit(1);
  }

  // Asset base: detected from the built JS path (e.g. /creator-toolbox/assets/…),
  // falling back to $PAGES_BASE_PATH, then "/".
  const assetMatch = template.match(/src="([^"]*)\/assets\/[^"]*\.js"/);
  const base = assetMatch
    ? assetMatch[1] === ""
      ? "/"
      : `${assetMatch[1]}/`
    : process.env.PAGES_BASE_PATH || "/";

  // Route list: the same registry the sitemap is generated from.
  const manifest = JSON.parse(
    readFileSync(join(root, "frontend/public/route-manifest.json"), "utf8"),
  );
  const routes = manifest.pages;
  if (!Array.isArray(routes) || routes.length === 0) {
    console.error("route-manifest.json has no pages");
    process.exit(1);
  }
  // Cross-check against the sitemap so a drifted sitemap cannot silently
  // leave a listed URL without a static file.
  const sitemap = readFileSync(join(root, "frontend/public/sitemap.xml"), "utf8");
  const sitemapPaths = [...sitemap.matchAll(/<loc>[^<]*<\/loc>/g)].map((m) =>
    m[0].replace(/<\/?loc>/g, "").replace(SITE_URL, "") || "/",
  );
  const missing = sitemapPaths.filter((p) => !routes.includes(p));
  if (missing.length) {
    console.error(`sitemap lists ${missing.length} URL(s) not in route-manifest.json: ${missing.join(", ")}`);
    process.exit(1);
  }

  let written = 0;
  for (const path of routes) {
    const meta = routeMeta(path);
    const seo = pageMeta({ title: meta.title, description: meta.description, path });
    const links = [
      { href: "/", label: SITE_NAME },
      ...meta.links,
    ];
    const staticBody =
      `<main class="container section"><h1>${esc(meta.h1)}</h1>` +
      `<p class="lede">${esc(meta.lede)}</p>` +
      `<p>${links.map((l) => `<a href="${esc(withBase(base, l.href))}">${esc(l.label)}</a>`).join(" · ")}</p></main>`;

    let html = template;
    // Strip tags a previous prerender run inserted (idempotent re-runs).
    html = html.replace(/<!-- prerendered: route [^>]*-->\n?/g, "");
    html = html.replace(/<link rel="canonical"[^>]*>\n?/g, "");
    html = html.replace(/<meta name="robots"[^>]*>\n?/g, "");
    html = html.replace(/<meta property="og:[^>]*>\n?/g, "");
    html = html.replace(
      /<script type="application\/ld\+json" data-prerender="1">[\s\S]*?<\/script>\n?/g,
      "",
    );
    // Title + meta description (mirror SeoHead/pageMeta).
    if (!/<title>[\s\S]*?<\/title>/.test(html)) {
      console.error(`template has no <title> to replace (route ${path})`);
      process.exit(1);
    }
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`);
    if (!/<meta name="description"/.test(html)) {
      console.error(`template has no meta description to replace (route ${path})`);
      process.exit(1);
    }
    html = html.replace(
      /<meta name="description" content=".*?"[^>]*>/,
      `<meta name="description" content="${esc(meta.description)}" />`,
    );
    // Canonical, robots, OG tags + JSON-LD before </head>.
    const jsonLdBlock =
      meta.jsonLd && meta.jsonLd.length
        ? `<script type="application/ld+json" data-prerender="1">${JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c")}</script>\n`
        : "";
    const headBlock =
      `<!-- prerendered: route ${path} -->\n` +
      `<link rel="canonical" href="${esc(seo.canonical)}" />\n` +
      `<meta name="robots" content="index,follow" />\n` +
      `<meta property="og:type" content="website" />\n` +
      `<meta property="og:title" content="${esc(meta.title)}" />\n` +
      `<meta property="og:description" content="${esc(meta.description)}" />\n` +
      `<meta property="og:url" content="${esc(seo.canonical)}" />\n` +
      `<meta property="og:site_name" content="${esc(SITE_NAME)}" />\n` +
      jsonLdBlock;
    if (!/<\/head>/.test(html)) {
      console.error(`template has no </head> (route ${path})`);
      process.exit(1);
    }
    html = html.replace("</head>", `${headBlock}</head>`);
    // Static content inside #root (createRoot replaces it on mount).
    // Static body contains no <div>, so the non-greedy match is exact.
    if (!/<div id="root">[\s\S]*?<\/div>/.test(html)) {
      console.error(`template has no <div id="root">...</div> to replace (route ${path})`);
      process.exit(1);
    }
    html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${staticBody}</div>`);

    if (path === "/") {
      writeFileSync(templatePath, html);
      written++;
      continue;
    }
    // Directory index + extensionless twin (see header comment).
    const dir = join(outDir, path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
    written++;
    writeFileSync(join(outDir, `${path.slice(1)}.html`), html);
    written++;
  }
  console.log(`prerendered ${routes.length} routes -> ${written} files in ${outDir} (base ${base})`);
}

main();
