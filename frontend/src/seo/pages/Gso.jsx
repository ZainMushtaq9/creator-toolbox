import { useState } from "react";
import SeoLayout from "../components/SeoLayout.jsx";
import { runSeo, saveLocalReport } from "../seoApi.js";
import { gsoAnalysis, GSO_WEIGHTS } from "../services/gsoAnalysis.js";

// GSO — Generative Search Optimization diagnostic (internal framework only).
// 9 weighted factors, total 100. It cannot guarantee citation or inclusion
// in AI-generated answers.
const LABELS = {
  completeness: "Answer completeness", factualSupport: "Factual support", originality: "Originality",
  clarity: "Clarity", topicCoverage: "Topic coverage", structure: "Structure",
  entityClarity: "Entity clarity", crawlability: "Crawlability", freshness: "Freshness / transparency",
};

export default function Gso() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState("");
  const [result, setResult] = useState(null);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!html.trim() && !text.trim()) { setError("Paste page HTML or plain text to analyse."); return; }
    setError(""); setMsg(""); setBusy(true);
    try {
      const qs = questions.split("\n").map((q) => q.trim()).filter(Boolean);
      const { source: src, data } = await runSeo(
        "/api/v1/gso/analyze",
        { url: url.trim(), html, text, questions: qs },
        (body) => gsoAnalysis(body),
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
      saveLocalReport({ type: "gso-analysis", title: `GSO diagnostic: ${result.url || "page"} (${result.score}/100)`, data: result });
      setMsg("Saved as a local report (this browser only — not stored server-side).");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <SeoLayout title="GSO Diagnostic" description="Generative Search Optimization diagnostic: 9 weighted factors, 0–100, from supplied page text or HTML." path="/seo/gso">
      <h1>GSO Diagnostic</h1>
      <p className="lede">Internal GSO framework only: answer completeness, factual support, originality, clarity, topic coverage, structure, entity clarity, crawlability and freshness. No score can predict or guarantee inclusion in AI Overviews or any generative answer.</p>
      <div className="tool-box">
        <label htmlFor="gso-url">Page URL (optional)</label>
        <input id="gso-url" className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" />
        <label htmlFor="gso-html">Page HTML (paste — optional if text is supplied)</label>
        <textarea id="gso-html" className="input" rows={6} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="Paste the full HTML of the page…" />
        <label htmlFor="gso-text">Or plain text (optional if HTML is supplied)</label>
        <textarea id="gso-text" className="input" rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the page text…" />
        <label htmlFor="gso-qs">Questions the page should answer (one per line, optional)</label>
        <textarea id="gso-qs" className="input" rows={3} value={questions} onChange={(e) => setQuestions(e.target.value)} placeholder="What is an image compressor?&#10;How do I compress an image for free?" />
        <div className="toolbar">
          <button type="button" className="btn" onClick={run} disabled={busy}>{busy ? "Working…" : "Run GSO diagnostic"}</button>
        </div>
        {error && <p className="error">{error}</p>}
        {msg && <p className="success">{msg}</p>}
      </div>

      {result && (
        <>
          <p className="notice info" style={{ marginTop: 16 }}>Source: <strong>{source === "worker" ? "Worker" : "Local (browser)"}</strong> · Score: <strong>{result.score}/100</strong> · {result.note}</p>
          <div className="toolbar"><button type="button" className="btn secondary btn-sm" onClick={save}>Save as local report</button></div>
          <h2>Weighted factors</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={{ textAlign: "left" }}>Factor</th><th style={{ textAlign: "left" }}>Score</th><th style={{ textAlign: "left" }}>Weight</th><th style={{ textAlign: "left" }}>Evidence</th></tr></thead>
            <tbody>
              {Object.entries(result.factors).map(([k, v]) => (
                <tr key={k}><td>{LABELS[k] || k}</td><td>{v.score}</td><td>/ {GSO_WEIGHTS[k]}</td><td>{v.evidence}</td></tr>
              ))}
            </tbody>
          </table>
          {result.improvements?.length > 0 && (
            <>
              <h2 style={{ marginTop: 24 }}>Improvements to consider</h2>
              <ul>{result.improvements.map((imp, i) => <li key={i}>{imp}</li>)}</ul>
            </>
          )}
        </>
      )}
    </SeoLayout>
  );
}
