import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clapperboard, Image, Code2, Search, Sparkles, ArrowRight, Shield, Workflow, UserX, BadgeCheck } from "lucide-react";
import SeoHead from "../components/SeoHead.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ToolCard from "../components/ToolCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import { TOOLS, CATEGORIES } from "../config/tools.js";
import { PILLARS } from "../config/pillars.js";
import { ARTICLES } from "../config/blog.js";
import { websiteJsonLd, organizationJsonLd } from "../config/seo.js";

const PILLAR_ICONS = { Clapperboard, Image, Code2, Search, Sparkles };
const POPULAR = ["youtube-title-generator", "image-compressor", "word-counter", "instagram-caption-generator", "youtube-thumbnail-resizer", "tiktok-hook-generator"];

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const popular = useMemo(() => POPULAR.map((s) => TOOLS.find((t) => t.slug === s)).filter(Boolean), []);
  const goSearch = (q) => setQuery(q);
  const submitSearch = (e) => { e.preventDefault(); navigate(query.trim() ? `/tools?q=${encodeURIComponent(query.trim())}` : "/tools"); };
  return (
    <div>
      <SeoHead title="CreatorToolbox — Free Tools. Smarter Creation." description="Free online tools and AI-powered productivity for everyone. Create, optimize, convert and grow — YouTube, Instagram, TikTok, image and text tools that run in your browser." path="/" jsonLd={[websiteJsonLd(), organizationJsonLd()]} />
      {/* Hero — strategy tagline */}
      <section className="hero">
        <div className="container">
          <h1>Create. Optimize. Convert. Grow.</h1>
          <p>Free online tools and AI-powered productivity for everyone.</p>
          <form onSubmit={submitSearch}><SearchBar value={query} onChange={goSearch} /></form>
          <p style={{ marginTop: 12 }}><Link to="/tools" className="btn" style={{ background: "var(--accent)", color: "#102A43" }}>Browse all 21 free tools <ArrowRight size={16} style={{ verticalAlign: "-2px" }} /></Link> <Link to="/workflows" className="btn secondary" style={{ marginLeft: 8 }}>See workflows</Link></p>
          <p style={{ fontSize: ".95rem", opacity: .85 }}>No sign-up for the core tools. Most tools run in your browser — nothing is uploaded.</p>
        </div>
      </section>

      {/* Pillar cards */}
      <section className="section container">
        <h2>Five pillars, one toolbox</h2>
        <p className="lede">Tools grouped by what you are trying to do — not by a long alphabetical list.</p>
        <div className="grid">
          {PILLARS.map((p) => {
            const Icon = PILLAR_ICONS[p.icon] || Sparkles;
            return (
              <article className="card" key={p.slug}>
                <Icon size={28} color="#176B58" aria-hidden="true" />
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <p><strong>{p.tools.length ? `${p.tools.length} tools in Stage 1` : "Coming in a later stage"}</strong></p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Popular tools */}
      <section className="section container">
        <h2>Popular tools</h2>
        <p className="lede">The tools creators reach for most.</p>
        <div className="grid">{popular.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      </section>

      {/* Categories */}
      <section className="section container">
        <h2>Browse by category</h2>
        <div className="grid">{CATEGORIES.map((c) => <CategoryCard key={c.slug} category={c} />)}</div>
      </section>

      {/* All tools */}
      <section className="section container">
        <h2>All tools</h2>
        <p className="lede">Searchable directory of all 21 free tools.</p>
        <div className="grid">{TOOLS.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        <p style={{ marginTop: 16 }}><Link to="/tools">Open the searchable tool directory →</Link> · <Link to="/collections">Browse tool collections →</Link></p>
      </section>

      {/* Recently added */}
      <section className="section container">
        <h2>Recently added</h2>
        <p className="lede">New in the Stage 1 launch: all 21 tools, plus workflows, workspaces and collections.</p>
        <div className="grid">
          <article className="card"><h3><Link to="/workflows/youtube-creator">YouTube Creator Workflow</Link></h3><p>One topic carried through title, description, tags, thumbnail and a final check.</p></article>
          <article className="card"><h3><Link to="/workspaces">Workspaces</Link></h3><p>Save tool results into projects on your own device — no account needed.</p></article>
          <article className="card"><h3><Link to="/collections">Tool Collections</Link></h3><p>Curated kits: YouTube Starter, Instagram Growth, Blogger SEO and more.</p></article>
        </div>
      </section>

      {/* Why */}
      <section className="section container">
        <h2>Why CreatorToolbox</h2>
        <p className="lede">Five principles shape everything we build.</p>
        <div className="grid">
          <article className="card"><BadgeCheck size={26} color="#176B58" /><h3>Free core tools</h3><p>Core tools are free with no subscription required. Limits (like file sizes) are shown openly on each tool page — we do not claim the service is free of all limits forever.</p></article>
          <article className="card"><Shield size={26} color="#176B58" /><h3>Privacy-first</h3><p>Most tools process your text and images locally in your browser. Nothing is uploaded, and no account is needed to use them.</p></article>
          <article className="card"><UserX size={26} color="#176B58" /><h3>No unnecessary signup</h3><p>Use the tools straight away. Workspaces save to your own device, not to an account you did not ask for.</p></article>
          <article className="card"><Workflow size={26} color="#176B58" /><h3>Workflow-oriented</h3><p>Tools connect: a YouTube topic flows from title to description to thumbnail, and results can be saved into a workspace project.</p></article>
          <article className="card"><Sparkles size={26} color="#176B58" /><h3>Honest AI</h3><p>Every generator is labelled: template, calculation or AI. Stage-1 generators use templates, not AI — and each tool page says so.</p></article>
        </div>
      </section>

      {/* How it works */}
      <section className="section container">
        <h2>How it works</h2>
        <ol>
          <li><strong>Pick a tool</strong> — search the directory or browse a category, collection or workflow.</li>
          <li><strong>Enter your input</strong> — a topic, an image or some text. Most tools never send it anywhere.</li>
          <li><strong>Get the result</strong> — copy it, download it, or save it to a workspace project.</li>
          <li><strong>Move to the next step</strong> — related tools and workflows keep the work flowing.</li>
        </ol>
      </section>

      {/* Articles */}
      <section className="section container">
        <h2>Learn with the tools</h2>
        <div className="grid">
          {ARTICLES.slice(0, 3).map((a) => (
            <article className="card" key={a.slug}><h3><Link to={`/blog/${a.slug}`}>{a.title}</Link></h3><p>{a.description}</p></article>
          ))}
        </div>
        <p style={{ marginTop: 16 }}><Link to="/blog">Read all guides →</Link></p>
      </section>

      {/* FAQs */}
      <section className="section container faq">
        <h2>Frequently asked questions</h2>
        <details><summary>Are the tools really free?</summary><p>Yes — the core tools are free with no subscription required. Some have transparent limits (for example a 20 MB file limit), shown on each tool page.</p></details>
        <details><summary>Do I need an account?</summary><p>No. There is no signup for the core tools. Workspaces save to your browser's local storage on your own device.</p></details>
        <details><summary>Are my files uploaded?</summary><p>No, for the image and text tools. They run locally in your browser. AI features in later stages will say clearly what is sent and where.</p></details>
        <details><summary>Do the generators use AI?</summary><p>Not in Stage 1. Title, caption, bio, hook and hashtag generators use hand-written templates, and each tool page says so. AI features will be labelled AI when they arrive.</p></details>
        <details><summary>What is SEO Intelligence?</summary><p>It is the later advanced product — keyword research, audits, competitor analysis and Search Console, for the site owner. It is not part of the Stage 1 launch.</p></details>
      </section>
    </div>
  );
}
