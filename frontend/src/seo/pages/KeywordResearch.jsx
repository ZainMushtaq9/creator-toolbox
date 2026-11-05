import { useState } from "react";
import SeoLayout from "../components/SeoLayout.jsx";
import { runSeo, saveLocalReport } from "../seoApi.js";
import { generateSuggestions, clusterKeywords } from "../services/keywordResearch.js";

// Keyword research from deterministic variations of a seed term.
// Search volume and keyword difficulty are NEVER invented: every row shows
// "unavailable" unless a real source supplied a value (none does here).
export default function KeywordResearch() {
  const [seed, setSeed] = useState("");
  const [country, setCountry] = useState("US");
  const [language, setLanguage] = useState("en");
  const [result, setResult] = useState(null);
  const [clusters, setClusters] = useState(null);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!seed.trim()) { setError("Enter a seed keyword first."); return; }
    setError(""); setMsg(""); setBusy(true);
    try {
      const { source: src, data } = await runSeo(
        "/api/v1/keyword/research",
        { keyword: seed.trim(), country, language },
        (body) => generateSuggestions(body.keyword, { country: body.country, language: body.language }),
      );
      setResult(data);
      setSource(src);
      setClusters(clusterKeywords((data.suggestions || []).map((s) => s.suggestion)));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const save = () => {
    if (!result) return;
    try {
      saveLocalReport({ type: "keyword-research", title: `Keyword research: ${result.keyword}`, data: result });
      setMsg("Saved as a local report (this browser only — not stored server-side).");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <SeoLayout title="Keyword Research" description="Deterministic keyword suggestions from a seed term. Search volume and difficulty are never invented." path="/seo/keywords">
      <h1>Keyword Research</h1>
      <p className="lede">Suggestions are deterministic variations of your seed term. Search volume and keyword difficulty are <strong>unavailable</strong> — no source supplied them, and they are never invented. No Google SERP scraping.</p>
      <div className="tool-box">
        <label htmlFor="kw-seed">Seed keyword</label>
        <input id="kw-seed" className="input" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="e.g. image compressor" />
        <label htmlFor="kw-country">Country</label>
        <input id="kw-country" className="input" value={country} onChange={(e) => setCountry(e.target.value)} />
        <label htmlFor="kw-lang">Language</label>
        <input id="kw-lang" className="input" value={language} onChange={(e) => setLanguage(e.target.value)} />
        <div className="toolbar">
          <button type="button" className="btn" onClick={run} disabled={busy}>{busy ? "Working…" : "Research keywords"}</button>
        </div>
        {error && <p className="error">{error}</p>}
        {msg && <p className="success">{msg}</p>}
      </div>

      {result && (
        <>
          <p className="notice info" style={{ marginTop: 16 }}>
            Source: <strong>{source === "worker" ? "Worker" : "Local (browser)"}</strong> · Seed: <strong>{result.keyword}</strong> · Intent: <strong>{result.searchIntent}</strong> · {result.note}
          </p>
          <div className="toolbar"><button type="button" className="btn secondary btn-sm" onClick={save}>Save as local report</button></div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
            <thead><tr><th style={{ textAlign: "left" }}>Suggestion</th><th style={{ textAlign: "left" }}>Source</th><th style={{ textAlign: "left" }}>Search volume</th><th style={{ textAlign: "left" }}>Difficulty</th></tr></thead>
            <tbody>
              {result.suggestions.map((s) => (
                <tr key={s.suggestion}>
                  <td>{s.suggestion}</td><td>{s.source}</td><td>unavailable</td><td>unavailable</td>
                </tr>
              ))}
            </tbody>
          </table>
          {clusters && (
            <>
              <h2 style={{ marginTop: 24 }}>Clusters (local deterministic grouping)</h2>
              <p>{clusters.note}</p>
              {clusters.clusters.map((c) => (
                <article className="card" key={c.name} style={{ marginTop: 8 }}>
                  <h3>{c.name}</h3>
                  <p>{c.terms.join(", ")}</p>
                </article>
              ))}
            </>
          )}
        </>
      )}
    </SeoLayout>
  );
}
