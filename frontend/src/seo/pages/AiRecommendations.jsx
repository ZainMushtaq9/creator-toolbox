import { useState } from "react";
import { Link } from "react-router-dom";
import SeoLayout from "../components/SeoLayout.jsx";
import { isWorkerConfigured, saveLocalReport, seoFetch } from "../seoApi.js";

// AI recommendations — Worker-backed only. In LOCAL mode (no Worker / no
// key) this page does NOT fake AI output: it says so plainly and points at
// the deterministic Page Audit instead. When a result returns, its mode
// (live/mock), provider and note are shown, plus the evidenceRequired
// warning. Recommendations are drafts only: nothing is auto-published.
// Saving stores the draft with status "pending approval".
const TASKS = ["seoAnalysis", "competitorAnalysis", "contentGeneration"];

export default function AiRecommendations() {
  const [task, setTask] = useState("seoAnalysis");
  const [prompt, setPrompt] = useState("");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState(false);

  const workerConfigured = isWorkerConfigured();

  const run = async () => {
    if (!prompt.trim()) { setError("Enter a prompt for the AI task."); return; }
    setError(""); setMsg(""); setResult(null); setBusy(true);
    try {
      const data = await seoFetch("/api/v1/ai/recommendations", {
        method: "POST",
        body: { task, prompt: prompt.trim(), topic: topic.trim() || undefined },
      });
      setResult(data);
      setSource(data.mode === "live" ? "live" : "mock");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const saveDraft = () => {
    if (!result) return;
    try {
      saveLocalReport({
        type: "ai-recommendation",
        title: `AI recommendation (${task}) — ${topic || "no topic"}`,
        data: { ...result, approvedByOwner: approved, status: approved ? "approved draft" : "pending approval" },
      });
      setMsg("Draft saved to Reports with status “pending approval” (local report — nothing was published or applied automatically).");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <SeoLayout title="AI Recommendations" description="AI SEO recommendations via the Worker (Cloudflare Workers AI). Drafts only — never auto-published." path="/seo/ai">
      <h1>AI Recommendations</h1>

      {!workerConfigured ? (
        <div className="tool-box">
          <h2>AI is NOT production-connected</h2>
          <p>
            AI recommendations need the deployed Worker (default provider
            Cloudflare Workers AI — it needs no key, just the Cloudflare
            account the Worker runs on). No Worker API URL is configured
            here, so <strong>no AI output is shown and none is faked</strong>.
          </p>
          <p>
            For deterministic recommendations right now, use <Link to="/seo/audit">Page Audit</Link> — it runs
            entirely in this browser and gives evidence-backed findings with no AI involved.
          </p>
          <p>
            To connect AI later: deploy the Worker and set <code>VITE_API_URL</code>. Long-context overflow
            (Google Gemini) needs the <code>GEMINI_API_KEY</code> Worker secret — see{" "}
            <Link to="/seo/settings">Settings</Link> for the provider details and the honest free limits.
          </p>
        </div>
      ) : (
        <>
          <p className="lede">Worker-backed AI (default provider Cloudflare Workers AI — no key needed). Results are drafts only — they are never published or applied automatically, and must be checked against deterministic audit evidence first.</p>
          <div className="tool-box">
            <label htmlFor="ai-task">Task</label>
            <select id="ai-task" className="input" value={task} onChange={(e) => setTask(e.target.value)}>
              {TASKS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <label htmlFor="ai-topic">Topic (optional)</label>
            <input id="ai-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. image compressor tool page" />
            <label htmlFor="ai-prompt">Prompt</label>
            <textarea id="ai-prompt" className="input" rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what the AI should analyse or draft…" />
            <div className="toolbar">
              <button type="button" className="btn" onClick={run} disabled={busy}>{busy ? "Working…" : "Get AI recommendations"}</button>
            </div>
            {error && <p className="error">{error}</p>}
            {msg && <p className="success">{msg}</p>}
          </div>

          {result && (
            <div style={{ marginTop: 16 }}>
              <p className="notice info">
                Mode: <strong>{result.mode || source}</strong> · Provider: <strong>{result.provider || "unknown"}</strong> · Model: <strong>{result.model || "—"}</strong>
                {result.note ? ` · ${result.note}` : ""}
              </p>
              {result.evidenceRequired && <p className="notice"><strong>Evidence required:</strong> {result.evidenceRequired}</p>}
              <article className="card">
                <h3>AI output (draft)</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{result.text || "(No text returned.)"}</p>
              </article>
              <div className="tool-box" style={{ marginTop: 16 }}>
                <h2>Approve as a draft</h2>
                <p>Recommendations are drafts only and are never auto-published. Saving stores the draft in Reports with status &ldquo;pending approval&rdquo; until you approve it.</p>
                <label>
                  <input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)} /> I have reviewed this draft and approve it as a draft (it still will not be published automatically).
                </label>
                <div className="toolbar">
                  <button type="button" className="btn secondary" onClick={saveDraft}>Save draft to Reports (pending approval)</button>
                </div>
                {msg && <p className="success">{msg}</p>}
              </div>
            </div>
          )}
        </>
      )}
    </SeoLayout>
  );
}
