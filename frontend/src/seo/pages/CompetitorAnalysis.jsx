import { useState } from "react";
import SeoLayout from "../components/SeoLayout.jsx";
import { runSeo, saveLocalReport } from "../seoApi.js";
import { comparePages } from "../services/competitorAnalysis.js";

// Side-by-side comparison of PUBLIC page metadata only (title, description,
// H1s, word count, images, links, structured data) from HTML the owner
// pastes in. Never claims competitor traffic, rankings or private analytics.
export default function CompetitorAnalysis() {
  const [ownUrl, setOwnUrl] = useState("");
  const [ownHtml, setOwnHtml] = useState("");
  const [compUrl, setCompUrl] = useState("");
  const [compHtml, setCompHtml] = useState("");
  const [result, setResult] = useState(null);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!ownHtml.trim() || !compHtml.trim()) {
      setError("Paste HTML for both your page and the competitor page. (Worker mode fetches the competitor URL instead — see note below.)");
      return;
    }
    setError(""); setMsg(""); setBusy(true);
    try {
      const { source: src, data } = await runSeo(
        "/api/v1/competitor/analyze",
        { ownUrl, ownHtml, competitorUrl: compUrl, competitorHtml: compHtml },
        (body) => comparePages({ ownUrl: body.ownUrl, ownHtml: body.ownHtml, competitorUrl: body.competitorUrl, competitorHtml: body.competitorHtml }),
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
      saveLocalReport({ type: "competitor-analysis", title: `Competitor comparison: ${ownUrl || "own page"} vs ${compUrl || "competitor"}`, data: result });
      setMsg("Saved as a local report (this browser only — not stored server-side).");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <SeoLayout title="Competitor Analysis" description="Side-by-side comparison of public page metadata for your page and a competitor page." path="/seo/competitor">
      <h1>Competitor Analysis</h1>
      <p className="lede">Compares public page metadata only — title, description, H1s, word count, images, links, structured data. Competitor traffic and rankings are <strong>not</strong> available and are never claimed.</p>
      <div className="tool-box">
        <label htmlFor="ca-own-url">Your page URL</label>
        <input id="ca-own-url" className="input" value={ownUrl} onChange={(e) => setOwnUrl(e.target.value)} placeholder="https://example.com/your-page" />
        <label htmlFor="ca-own-html">Your page HTML (paste)</label>
        <textarea id="ca-own-html" className="input" rows={6} value={ownHtml} onChange={(e) => setOwnHtml(e.target.value)} placeholder="Paste the full HTML of your page…" />
        <label htmlFor="ca-comp-url">Competitor page URL</label>
        <input id="ca-comp-url" className="input" value={compUrl} onChange={(e) => setCompUrl(e.target.value)} placeholder="https://competitor.example/page" />
        <label htmlFor="ca-comp-html">Competitor page HTML (paste)</label>
        <textarea id="ca-comp-html" className="input" rows={6} value={compHtml} onChange={(e) => setCompHtml(e.target.value)} placeholder="Paste the full HTML of the competitor page…" />
        <div className="toolbar">
          <button type="button" className="btn" onClick={run} disabled={busy}>{busy ? "Working…" : "Compare pages"}</button>
        </div>
        {error && <p className="error">{error}</p>}
        {msg && <p className="success" role="status">{msg}</p>}
        <p className="notice">In local mode the browser cannot fetch other sites (CORS), so both pages are compared from pasted HTML. When the Worker is configured, it fetches the competitor URL server-side instead.</p>
      </div>

      {result && (
        <>
          <p className="notice info" style={{ marginTop: 16 }}>Source: <strong>{source === "worker" ? "Worker" : "Local (browser)"}</strong> · {result.note}</p>
          <div className="toolbar"><button type="button" className="btn secondary btn-sm" onClick={save}>Save as local report</button></div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
            <thead><tr><th style={{ textAlign: "left" }}>Field</th><th style={{ textAlign: "left" }}>Your page</th><th style={{ textAlign: "left" }}>Competitor</th></tr></thead>
            <tbody>
              {result.rows.map((r) => (
                <tr key={r.field}><td>{r.field}</td><td>{r.own}</td><td>{r.competitor}</td></tr>
              ))}
            </tbody>
          </table>
          <h2 style={{ marginTop: 24 }}>Gaps found</h2>
          <ul>{result.gaps.map((g, i) => <li key={i}>{g}</li>)}</ul>
        </>
      )}
    </SeoLayout>
  );
}
