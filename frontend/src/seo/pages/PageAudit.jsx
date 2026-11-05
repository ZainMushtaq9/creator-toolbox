import { useState } from "react";
import SeoLayout from "../components/SeoLayout.jsx";
import { runSeo, apiMode, saveLocalReport } from "../seoApi.js";
import { auditPage, AUDIT_WEIGHTS } from "../services/pageAudit.js";

// Deterministic on-page SEO audit (0–100). Weights: metadata 15, content
// structure 15, keyword relevance 15, technical 20, internal linking 10,
// images 10, structured data 5, mobile/performance 10. A critical noindex
// finding is always shown prominently, even when the aggregate score is high.
const LABELS = {
  metadata: "Metadata", contentStructure: "Content structure", keywordRelevance: "Keyword relevance",
  technical: "Technical SEO", internalLinking: "Internal linking", images: "Images",
  structuredData: "Structured data", mobilePerformance: "Mobile / performance",
};

export default function PageAudit() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState(null);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!url.trim()) { setError("Enter the page URL to audit."); return; }
    // URL-only works in Worker mode (the Worker fetches the page
    // server-side). In local mode the browser cannot fetch other sites
    // (CORS), so pasted HTML is still required there.
    if (!html.trim() && apiMode() !== "worker") { setError("Paste the page HTML — in local mode the browser cannot fetch other sites, so the audit runs from pasted HTML only. (In Worker mode, entering the URL alone is enough.)"); return; }
    setError(""); setMsg(""); setBusy(true);
    try {
      const { source: src, data } = await runSeo(
        "/api/v1/audit/page",
        { url: url.trim(), html, keyword: keyword.trim() },
        (body) => auditPage(body),
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
      saveLocalReport({ type: "page-audit", title: `Page audit: ${result.url} (${result.score}/100)`, data: result });
      setMsg("Saved as a local report (this browser only — not stored server-side).");
    } catch (e) {
      setError(e.message);
    }
  };

  const critical = result?.findings?.filter((f) => f.severity === "critical") || [];

  return (
    <SeoLayout title="Page Audit" description="Deterministic on-page SEO audit with category scores and findings." path="/seo/audit">
      <h1>Page Audit</h1>
      <p className="lede">Enter a page URL to audit it. In Worker mode the Worker fetches the page for you — pasting HTML is optional. Note: a URL-only fetch reads the page&rsquo;s raw HTML, so JavaScript-rendered content is not visible to it and content scores may understate a JavaScript-rendered page — for full content scores, paste the page&rsquo;s rendered HTML instead. In local mode, paste the page HTML (the browser cannot fetch other sites). The score is a CreatorToolbox diagnostic (0–100), not a Google ranking formula. In local mode nothing leaves this browser.</p>
      <div className="tool-box">
        <label htmlFor="pa-url">Page URL</label>
        <input id="pa-url" className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" />
        <label htmlFor="pa-keyword">Target keyword (optional)</label>
        <input id="pa-keyword" className="input" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. image compressor" />
        <label htmlFor="pa-html">Page HTML (paste — optional in Worker mode)</label>
        <textarea id="pa-html" className="input" rows={8} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="Paste the full HTML of the page… (leave empty in Worker mode to let the Worker fetch the URL)" />
        <div className="toolbar">
          <button type="button" className="btn" onClick={run} disabled={busy}>{busy ? "Working…" : "Run audit"}</button>
        </div>
        {error && <p className="error">{error}</p>}
        {msg && <p className="success">{msg}</p>}
      </div>

      {result && (
        <>
          {result.summary?.noindex && (
            <p className="error" style={{ marginTop: 16 }}>
              <strong>CRITICAL — page is noindex:</strong> the robots meta tells search engines not to index
              this page, so it cannot appear in search results at all — even though the aggregate score below
              may look high. Remove noindex if the page should appear in search.
            </p>
          )}
          {critical.length > 0 && !result.summary?.noindex && (
            <p className="error" style={{ marginTop: 16 }}>
              <strong>Critical findings ({critical.length}):</strong> {critical.map((f) => f.evidence).join(" ")}
            </p>
          )}
          <p className="notice info" style={{ marginTop: 16 }}>
            Source: <strong>{source === "worker" ? "Worker" : "Local (browser)"}</strong> · Score: <strong>{result.score}/100</strong> · {result.note}
          </p>
          <div className="toolbar"><button type="button" className="btn secondary btn-sm" onClick={save}>Save as local report</button></div>
          <h2>Category breakdown</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={{ textAlign: "left" }}>Category</th><th style={{ textAlign: "left" }}>Score</th><th style={{ textAlign: "left" }}>Weight</th></tr></thead>
            <tbody>
              {Object.entries(result.scores).map(([k, v]) => (
                <tr key={k}><td>{LABELS[k] || k}</td><td>{v}</td><td>/ {AUDIT_WEIGHTS[k]}</td></tr>
              ))}
            </tbody>
          </table>
          <p>Title: {result.summary?.title || "(none)"} · H1s: {result.summary?.h1Count} · Words: {result.summary?.wordCount} · Images: {result.summary?.imageCount} · Links: {result.summary?.linkCount}</p>
          <h2>Findings ({result.findings.length})</h2>
          {result.findings.map((f, i) => (
            <article className="card" key={i} style={{ marginTop: 8 }}>
              <h3>{f.severity.toUpperCase()} — {LABELS[f.category] || f.category}</h3>
              <p><strong>Evidence:</strong> {f.evidence}</p>
              <p><strong>Recommendation:</strong> {f.recommendation}</p>
              <p><strong>Benefit:</strong> {f.benefit}</p>
              <p>Status: {f.status}</p>
            </article>
          ))}
        </>
      )}
    </SeoLayout>
  );
}
