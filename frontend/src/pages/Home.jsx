import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clapperboard, Image, Code2, Search, Sparkles, ArrowRight, Shield, Workflow, UserX, BadgeCheck } from "lucide-react";
import SeoHead from "../components/SeoHead.jsx";
import SearchBar from "../components/SearchBar.jsx";
import AdSlot from "../components/AdSlot.jsx";
import ToolCard from "../components/ToolCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import { TOOLS, CATEGORIES } from "../config/tools.js";
import { PILLARS } from "../config/pillars.js";
import { ARTICLES } from "../config/blog.js";
import { faqJsonLd } from "../config/seo.js";

const PILLAR_ICONS = { Clapperboard, Image, Code2, Search, Sparkles };
const POPULAR = ["youtube-title-generator", "image-compressor", "word-counter", "instagram-caption-generator", "youtube-thumbnail-resizer", "tiktok-hook-generator"];
const HOME_FAQS = [
  { q: "Are the tools really free?", a: "Yes — the core tools are free with no subscription required. Some have transparent limits (for example a 20 MB file limit), shown on each tool page." },
  { q: "Do I need an account?", a: "No. There is no signup for the core tools. Workspaces save to your browser's local storage on your own device." },
  { q: "Are my files uploaded?", a: "No, for the image and text tools. They run locally in your browser. AI features in later stages will say clearly what is sent and where." },
  { q: "Do the generators use AI?", a: "Not in Stage 1. Title, caption, bio, hook and hashtag generators use hand-written templates, and each tool page says so. AI features will be labelled AI when they arrive." },
  { q: "What is SEO Intelligence?", a: "It is the later advanced product — keyword research, audits, competitor analysis and Search Console, for the site owner. It is not part of the Stage 1 launch." }
];

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const popular = useMemo(() => POPULAR.map((s) => TOOLS.find((t) => t.slug === s)).filter(Boolean), []);
  const goSearch = (q) => setQuery(q);
  const submitSearch = (e) => { e.preventDefault(); navigate(query.trim() ? `/tools?q=${encodeURIComponent(query.trim())}` : "/tools"); };
  return (
    <div>
      <SeoHead title="Free Online Tools" description="Free online tools and AI-powered productivity for everyone. Create, optimize, convert and grow with free YouTube, Instagram, TikTok, image, text and calculator tools." path="/" jsonLd={faqJsonLd(HOME_FAQS)} />
      {/* NOTE: WebSite + Organization JSON-LD now live statically in
          index.html so crawlers see them without JavaScript. */}
      {/* Hero — strategy tagline */}
      <section className="hero">
        <div className="container">
          <p className="hero-badge">✦ 41 free tools · No sign-up · Privacy-first</p>
          <h1>Create. Optimize. Convert. <span className="accent">Grow.</span></h1>
          <p>CreatorToolbox is a free collection of 41 online tools for YouTube, Instagram, TikTok, images, text and calculators — free with no sign-up, running in your browser so nothing is uploaded.</p>
          <form onSubmit={submitSearch}><SearchBar value={query} onChange={goSearch} /></form>
          <p style={{ marginTop: 16 }}><Link to="/tools" className="btn" style={{ background: "var(--accent)", color: "#102A43" }}>Browse all 41 free tools <ArrowRight size={16} style={{ verticalAlign: "-2px" }} /></Link> <Link to="/workflows" className="btn secondary" style={{ marginLeft: 8 }}>See workflows</Link></p>
          <p style={{ fontSize: ".95rem", opacity: .85 }}>No sign-up for the core tools. Most tools run in your browser — nothing is uploaded.</p>
          <div className="hero-stats">
            <div><b>41</b><span>free tools</span></div>
            <div><b>6</b><span>categories</span></div>
            <div><b>0</b><span>sign-up needed</span></div>
            <div><b>100%</b><span>browser-local</span></div>
          </div>
        </div>
      </section>

      {/* Ad placeholder — leaderboard below the hero (placeholder only,
          real ads appear here only after AdSense approval). */}
      <div className="container"><AdSlot slot="homeLeaderboard" /></div>

      {/* Pillar cards */}
      <section className="section container">
        <p className="kicker">Start here</p>
        <h2>Five pillars, one toolbox</h2>
        <p className="lede">Tools grouped by what you are trying to do — not by a long alphabetical list.</p>
        <div className="grid">
          {PILLARS.map((p) => {
            const Icon = PILLAR_ICONS[p.icon] || Sparkles;
            return (
              <article className="card" key={p.slug}>
                <span className="icon-chip"><Icon size={24} color="#176B58" aria-hidden="true" /></span>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <p><strong>{p.tools.length ? `${p.tools.length} tools` : "Coming in a later stage"}</strong></p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Popular tools */}
      <section className="section container">
        <p className="kicker">Most loved</p>
        <h2>Popular tools</h2>
        <p className="lede">The tools creators reach for most.</p>
        <div className="grid">{popular.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      </section>

      {/* Categories */}
      <section className="section container">
        <p className="kicker">Browse</p>
        <h2>Browse by category</h2>
        <div className="grid">{CATEGORIES.map((c) => <CategoryCard key={c.slug} category={c} />)}</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <caption className="sr-only">Tools by category</caption>
          <thead><tr><th scope="col" style={{ textAlign: "left" }}>Category</th><th scope="col" style={{ textAlign: "left" }}>Tools</th><th scope="col" style={{ textAlign: "left" }}>What they cover</th></tr></thead>
          <tbody>
            {CATEGORIES.map((c) => (
              <tr key={c.slug}>
                <td><Link to={c.path}>{c.name}</Link></td>
                <td>{TOOLS.filter((t) => t.category === c.slug).length}</td>
                <td>{c.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* All tools */}
      <section className="section container">
        <p className="kicker">Directory</p>
        <h2>All 41 free online tools</h2>
        <p className="lede">Searchable directory of all 41 free tools.</p>
        <div className="grid">{TOOLS.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        <p style={{ marginTop: 16 }}><Link to="/tools">Open the searchable tool directory →</Link> · <Link to="/collections">Browse tool collections →</Link></p>
      </section>

      {/* Recently added */}
      <section className="section container">
        <p className="kicker">New</p>
        <h2>Recently added</h2>
        <p className="lede">New: 20 calculator tools join the Stage 1 launch set of 21 tools, plus workflows, workspaces and collections.</p>
        <div className="grid">
          <article className="card"><h3><Link to="/workflows/youtube-creator">YouTube Creator Workflow</Link></h3><p>One topic carried through title, description, tags, thumbnail and a final check.</p></article>
          <article className="card"><h3><Link to="/workspaces">Workspaces</Link></h3><p>Save tool results into projects on your own device — no account needed.</p></article>
          <article className="card"><h3><Link to="/collections">Tool Collections</Link></h3><p>Curated kits: YouTube Starter, Instagram Growth, Blogger SEO and more.</p></article>
        </div>
      </section>

      {/* Why */}
      <section className="section container">
        <p className="kicker">Our promise</p>
        <h2>Why CreatorToolbox</h2>
        <p className="lede">Five principles shape everything we build.</p>
        <div className="grid">
          <article className="card"><span className="icon-chip"><BadgeCheck size={24} color="#176B58" /></span><h3>Free core tools</h3><p>Core tools are free with no subscription required. Limits (like file sizes) are shown openly on each tool page — we do not claim the service is free of all limits forever.</p></article>
          <article className="card"><span className="icon-chip"><Shield size={24} color="#176B58" /></span><h3>Privacy-first</h3><p>Most tools process your text and images locally in your browser. Nothing is uploaded, and no account is needed to use them.</p></article>
          <article className="card"><span className="icon-chip"><UserX size={24} color="#176B58" /></span><h3>No unnecessary signup</h3><p>Use the tools straight away. Workspaces save to your own device, not to an account you did not ask for.</p></article>
          <article className="card"><span className="icon-chip"><Workflow size={24} color="#176B58" /></span><h3>Workflow-oriented</h3><p>Tools connect: a YouTube topic flows from title to description to thumbnail, and results can be saved into a workspace project.</p></article>
          <article className="card"><span className="icon-chip"><Sparkles size={24} color="#176B58" /></span><h3>Honest AI</h3><p>Every generator is labelled: template, calculation or AI. Stage-1 generators use templates, not AI — and each tool page says so.</p></article>
        </div>
      </section>

      {/* How it works */}
      <section className="section container">
        <p className="kicker">Three steps</p>
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
        <p className="kicker">Guides</p>
        <h2>Learn with the tools</h2>
        <div className="grid">
          {ARTICLES.slice(0, 3).map((a) => (
            <article className="card" key={a.slug}><h3><Link to={`/blog/${a.slug}`}>{a.title}</Link></h3><p>{a.description}</p></article>
          ))}
        </div>
        <p style={{ marginTop: 16 }}><Link to="/blog">Read all guides →</Link></p>
      </section>

      {/* Questions creators ask — question-led headings with direct answers. */}
      <section className="section container">
        <p className="kicker">Quick answers</p>
        <h2>How do I count words online?</h2>
        <p>Paste your text into the <Link to="/tools/word-counter">free Word Counter</Link> and the count updates live as you type — words, characters, sentences, paragraphs and reading time. For example, a 500-word essay takes about 2–3 minutes to read.</p>
        <h2>How do I write a better YouTube title?</h2>
        <p>Enter your video topic in the <Link to="/tools/youtube-title-generator">free YouTube Title Generator</Link> and pick a style — how-to, list, curiosity or question. For example, the topic “budget travel in Pakistan” becomes “7 Budget Travel Mistakes in Pakistan (I Learned the Hard Way)”.</p>
        <h2>How do I compress an image without uploading it?</h2>
        <p>Open the <Link to="/tools/image-compressor">free Image Compressor</Link>, choose a quality level and download the smaller file. Compression runs entirely in your browser, so your image never leaves your device — a 4 MB phone photo often shrinks to under 800 KB at 80% quality.</p>
        <h2>How do I find hashtags for Instagram?</h2>
        <p>Enter your post topic in the <Link to="/tools/instagram-hashtag-generator">free Instagram Hashtag Generator</Link> and copy up to 5 relevant hashtags. For example, a travel photo topic gives #TravelPhotography, #Wanderlust and #PhotoOfTheDay.</p>
      </section>

      {/* Ad placeholder — in-content, before the FAQs (placeholder only). */}
      <div className="container"><AdSlot slot="homeInContent" /></div>

      {/* FAQs */}
      <section className="section container faq">
        <h2>Frequently asked questions</h2>
        {HOME_FAQS.map((f, i) => (
          <details key={i}><summary>{f.q}</summary><p>{f.a}</p></details>
        ))}
        <p style={{ fontSize: ".9rem", opacity: .8, marginTop: 16 }}>By CreatorToolbox · Page last updated November 2026</p>
      </section>
    </div>
  );
}
