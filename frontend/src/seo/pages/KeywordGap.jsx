import { useState } from "react";
import SeoLayout from "../components/SeoLayout.jsx";
import { runSeo, saveLocalReport } from "../seoApi.js";
import { contentGaps } from "../services/contentGap.js";

// Keyword / content gap analysis: topics present in a competitor page's
// headings but missing from your page, plus supplied keywords the
// competitor covers and you do not. Computed from supplied text only —
// no search volume, rankings or competitor traffic involved.
export default function KeywordGap() {
  const [ownUrl, setOwnUrl] = useState("");
  const [ownHtml, setOwnHtml] = useState("");
  const [compUrl, setCompUrl] = useState("");
  const [compHtml, setCompHtml] = useState("");
  const [keywords, setKeywords] = useState("");
  const [result, setResult] = useState(null);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!ownHtml.trim() || !compHtml.trim()) { setError("Paste HTML for both your page and the competitor page."); return; }
    setError(""); setMsg(""); setBusy(true);
    try {
      const kw = keywords.split(/[\n,]+/).map((k) => k.trim()).filter(Boolean);
      const { source: src, data } = await runSeo(
        "/api/v1/content/gaps",
        { ownHtml, ownUrl, competitorHtml: compHtml, competitorUrl: compUrl, keywords: kw },
        (body) => contentGaps(body),
      );
      setResult(data);
      setSource(src);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const save = () => {
    if (!result) return;
    try {
      saveLocalReport({ type: "keyword-gap", title: `Keyword gap: ${ownUrl || "own page"} vs ${compUrl || "competitor"}`, data: result });
      setMsg("Saved as a local report (this browser only — not stored server-side).");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <SeoLayout title="Keyword Gap" description="Topics and keywords a competitor page covers that your page does not, from supplied page text only." path="/seo/gaps">
      <h1>Keyword Gap</h1>
      <p className="lede">Lists topics in the competitor page&rsquo;s headings that your page does not cover, and supplied keywords the competitor covers and you do not. Gaps are suggestions to consider, not proof that adding a topic will improve rankings.</p>
      <div className="tool-box">
        <label htmlFor="kg-own-url">Your page URL</label>
        <input id="kg-own-url" className="input" value={ownUrl} onChange={(e) => setOwnUrl(e.target.value)} placeholder="https://example.com/your-page" />
        <label htmlFor="kg-own-html">Your page HTML (paste)</label>
        <textarea id="kg-own-html" className="input" rows={6} value={ownHtml} onChange={(e) => setOwnHtml(e.target.value)} placeholder="Paste your page HTML…" />
        <label htmlFor="kg-comp-url">Competitor page URL</label>
        <input id="kg-comp-url" className="input" value={compUrl} onChange={(e) => setCompUrl(e.target.value)} placeholder="https://competitor.example/page" />
        <label htmlFor="kg-comp-html">Competitor page HTML (paste)</label>
        <textarea id="kg-comp-html" className="input" rows={6} value={compHtml} onChange={(e) => setCompHtml(e.target.value)} placeholder="Paste the competitor page HTML…" />
        <label htmlFor="kg-keywords">Keywords to check (one per line or comma-separated)</label>
        <textarea id="kg-keywords" className="input" rows={3} value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="image compressor&#10;free image tool" />
        <div className="toolbar">
          <button type="button" className="btn" onClick={run} disabled={busy}>{busy ? "Working…" : "Find gaps"}</button>
        </div>
        {error && <p className="error">{error}</p>}
        {msg && <p className="success">{msg}</p>}
      </div>

      {result && (
        <>
          <p className="notice info" style={{ marginTop: 16 }}>Source: <strong>{source === "worker" ? "Worker" : "Local (browser)"}</strong> · {result.note}</p>
          <div className="toolbar"><button type="button" className="btn secondary btn-sm" onClick={save}>Save as local report</button></div>
          <h2>Missing topics ({result.missingTopics.length})</h2>
          {result.missingTopics.length === 0 ? <p>No missing topics found in the competitor&rsquo;s headings.</p> : <ul>{result.missingTopics.map((t) => <li key={t}>{t}</li>)}</ul>}
          <h2>Topics already covered ({result.coveredTopics.length})</h2>
          {result.coveredTopics.length === 0 ? <p>None of the competitor&rsquo;s heading topics appear on your page.</p> : <ul>{result.coveredTopics.map((t) => <li key={t}>{t}</li>)}</ul>}
          <h2>Keyword gaps</h2>
          {result.keywordGaps.length === 0 ? <p>No supplied keyword is on the competitor page but missing on yours.</p> : (
            <ul>{result.keywordGaps.map((k) => <li key={k.keyword}><strong>{k.keyword}</strong> — {k.status}</li>)}</ul>
          )}
          <h2>Keywords covered</h2>
          {result.keywordCovered.length === 0 ? <p>None of the supplied keywords appear on your page.</p> : (
            <ul>{result.keywordCovered.map((k) => <li key={k.keyword}><strong>{k.keyword}</strong> — {k.status}</li>)}</ul>
          )}
          <h2>Recommendations</h2>
          <ul>{result.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </>
      )}
    </SeoLayout>
  );
}
