import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SeoHead from "../components/SeoHead.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ToolCard from "../components/ToolCard.jsx";
import { TOOLS, CATEGORIES } from "../config/tools.js";
import { trackEvent } from "../services/analytics.js";

export default function AllTools() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState("all");
  // search event: only the result count is sent — never the query text.
  const firstSearch = useRef(true);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t) =>
      (category === "all" || t.category === category) &&
      (!q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keywords.toLowerCase().includes(q))
    );
  }, [query, category]);
  const filteredCount = filtered.length;
  useEffect(() => {
    if (!query.trim()) return undefined;
    if (firstSearch.current) { firstSearch.current = false; return undefined; }
    const timer = setTimeout(() => trackEvent("search", { results_count: filteredCount }), 600);
    return () => clearTimeout(timer);
  }, [query, filteredCount]);
  return (
    <div className="container section">
      <SeoHead title="All Free Tools" description="Browse all 21 free CreatorToolbox tools — YouTube, Instagram, TikTok, image and text tools that run in your browser." path="/tools" />
      <h1>All Tools</h1>
      <p className="lede">21 free tools. Most run entirely in your browser — no upload, no sign-up.</p>
      <SearchBar value={query} onChange={setQuery} />
      <div className="toolbar" role="group" aria-label="Filter by category">
        <button type="button" className={`chip${category === "all" ? " active" : ""}`} onClick={() => setCategory("all")}>All ({TOOLS.length})</button>
        {CATEGORIES.map((c) => (
          <button key={c.slug} type="button" className={`chip${category === c.slug ? " active" : ""}`} onClick={() => setCategory(c.slug)}>{c.name}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p>No tools match “{query}”. Try a different word, or <button type="button" className="btn ghost btn-sm" onClick={() => { setQuery(""); setCategory("all"); }}>clear the search</button>.</p>
      ) : (
        <div className="grid">{filtered.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      )}
    </div>
  );
}
