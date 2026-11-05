import { useState } from "react";
import SeoLayout from "../components/SeoLayout.jsx";
import { runSeo, saveLocalReport } from "../seoApi.js";
import { aeoAnalysis } from "../services/aeoAnalysis.js";

// AEO — Answer Engine Optimization diagnostic: 8 checks, 0–100.
// Checks whether a page answers questions directly. A diagnostic only —
// it does not guarantee rich results or AI citations.
export default function Aeo() {
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
        "/api/v1/aeo/analyze",
        { url: url.trim(), html, text, questions: qs },
        (body) => aeoAnalysis(body),
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
      saveLocalReport({ type: "aeo-analysis", title: `AEO diagnostic: ${result.url || "page"} (${result.score}/100)`, data: result });
      setMsg("Saved as a local report (this browser only — not stored server-side).");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <SeoLayout title="AEO Diagnostic" description="Answer Engine Optimization diagnostic: 8 checks, 0–100, from supplied page text or HTML." path="/seo/aeo">
      <h1>AEO Diagnostic</h1>
      <p className="lede">Checks whether a page answers questions directly: a short direct answer early, question-led headings, definitions, examples, tables, references and visible authorship. Diagnostic only — it does not guarantee rich results or AI citations.</p>
      <div className="tool-box">
        <label htmlFor="aeo-url">Page URL (optional)</label>
        <input id="aeo-url" className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" />
        <label htmlFor="aeo-html">Page HTML (paste — optional if text is supplied)</label>
        <textarea id="aeo-html" className="input" rows={6} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="Paste the full HTML of the page…" />
        <label htmlFor="aeo-text">Or plain text (optional if HTML is supplied)</label>
        <textarea id="aeo-text" className="input" rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the page text…" />
        <label htmlFor="aeo-qs">Questions the page should answer (one per line, optional)</label>
        <textarea id="aeo-qs" className="input" rows={3} value={questions} onChange={(e) => setQuestions(e.target.value)} placeholder="What is an image compressor?&#10;How do I compress an image for free?" />
        <div className="toolbar">
          <button type="button" className="btn" onClick={run} disabled={busy}>{busy ? "Working…" : "Run AEO diagnostic"}</button>
        </div>
        {error && <p className="error">{error}</p>}
        {msg && <p className="success">{msg}</p>}
      </div>

      {result && (
        <>
          <p className="notice info" style={{ marginTop: 16 }}>Source: <strong>{source === "worker" ? "Worker" : "Local (browser)"}</strong> · Score: <strong>{result.score}/100</strong> · {result.note}</p>
          <div className="toolbar"><button type="button" className="btn secondary btn-sm" onClick={save}>Save as local report</button></div>
          <h2>8 checks</h2>
          {result.checks.map((c, i) => (
            <article className="card" key={i} style={{ marginTop: 8 }}>
              <h3>{c.passed ? "✓" : "✗"} {c.name}</h3>
              <p>{c.evidence}</p>
              {!c.passed && <p><strong>Recommendation:</strong> {c.recommendation}</p>}
            </article>
          ))}
          {result.questionsAnswered?.length > 0 && (
            <>
              <h2 style={{ marginTop: 24 }}>Questions answered</h2>
              <ul>{result.questionsAnswered.map((q, i) => <li key={i}>{q.answered ? "✓" : "✗"} {q.question}</li>)}</ul>
            </>
          )}
        </>
      )}
    </SeoLayout>
  );
}
