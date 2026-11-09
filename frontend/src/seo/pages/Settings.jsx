import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SeoLayout from "../components/SeoLayout.jsx";
import { apiBase, apiMode, isWorkerConfigured, seoFetch } from "../seoApi.js";
import { clearToken, getToken, setToken } from "../auth.js";

// Settings — shows the current configuration honestly. No secrets are ever
// displayed. The token can be changed or cleared here (sessionStorage only).
export default function Settings() {
  const [tokenInput, setTokenInput] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [gsc, setGsc] = useState(null);
  const [gscError, setGscError] = useState("");
  // Bumped after Change/Clear token so the API mode and token-presence
  // lines re-render immediately (setToken/clearToken only touch
  // sessionStorage, which React does not observe).
  const [, setVersion] = useState(0);

  useEffect(() => {
    if (isWorkerConfigured()) {
      seoFetch("/api/v1/gsc/status").then((d) => setGsc(d)).catch((e) => setGscError(e.message));
    }
  }, []);

  const changeToken = () => {
    if (!tokenInput.trim()) { setError("Enter a token first."); return; }
    setToken(tokenInput);
    setTokenInput("");
    setMsg("Token updated (stored in this tab's session storage only).");
    setError("");
    setVersion((v) => v + 1);
  };

  const clear = () => {
    clearToken();
    setMsg("Token cleared from session storage. The dashboard will lock when you navigate or reload.");
    setError("");
    setVersion((v) => v + 1);
  };

  return (
    <SeoLayout title="SEO Settings" description="SEO Intelligence configuration: AI provider, API status, token management and Search Console status." path="/seo/settings">
      <h1>Settings</h1>
      <p className="lede">Current configuration, stated honestly. No secrets are ever displayed on this page.</p>
      {msg && <p className="success" role="status">{msg}</p>}
      {error && <p className="error">{error}</p>}

      <div className="tool-box">
        <h2>AI provider</h2>
        <p><strong>Default provider: Cloudflare Workers AI</strong> — native binding <code>env.AI.run(...)</code>, no key, no card, no new account. Models: <code>@cf/meta/llama-4-scout-17b-16e-instruct</code> (131K served context) for chat tasks, <code>@cf/baai/bge-m3</code> (1024-dim) for embeddings.</p>
        <p><strong>Honest free limit:</strong> 10,000 Neurons/day per account, recurring forever, resets 00:00 UTC. Overage on the Free plan stops with an error. Free use is recurring, not a one-off trial.</p>
        <p><strong>Long-context overflow: Google AI Studio <code>gemini-2.5-flash</code></strong> (up to 1M tokens) — used only when input exceeds the Workers AI window, behind the Worker secret <code>GEMINI_API_KEY</code> (free tier, no card, key from aistudio.google.com). <strong>NOT CONNECTED</strong> until the owner supplies the key. Exact Gemini free-tier RPM/RPD are unpublished — no number is claimed.</p>
        <p><strong>Optional fallbacks (never the default):</strong> Hugging Face Inference Providers (<code>openai/gpt-oss-120b:fastest</code>, <code>HF_API_TOKEN</code> — free HF accounts get zero included credits; needs purchased credits, PRO, or a BYOK key); AnyRouter (<code>anyrouter/free</code>, <code>ANYROUTER_API_KEY</code> — 5-request lifetime trial, then Go $2/mo or a donated BYOK key); Groq (<code>openai/gpt-oss-120b</code>, <code>GROQ_API_KEY</code> — 30 RPM, 1,000 req/day, 200,000 tokens/day, no embeddings); NVIDIA NIM (<code>NVIDIA_API_KEY</code>, trial-only terms).</p>
        <p>Workers AI runs on the project&rsquo;s Cloudflare account and the Worker is <strong>LIVE in production</strong> with Workers AI as the default provider — no key, no card. Gemini, Hugging Face, AnyRouter, Groq and NVIDIA stay <strong>NOT CONNECTED</strong> until their keys/credits are supplied; no AI output is faked.</p>
      </div>

      <div className="tool-box" style={{ marginTop: 16 }}>
        <h2>API (Worker)</h2>
        <p>API URL (VITE_API_URL): <strong>{apiBase() || "(not set — empty)"}</strong></p>
        <p>API mode: <strong>{apiMode() === "worker" ? "Worker" : "Local (browser)"}</strong> — {apiMode() === "worker" ? "the Worker is configured and a token is present in this tab." : "no Worker calls are made; all modules run their deterministic local engine."}</p>
        <p>Health endpoint: <code>{apiBase() ? `${apiBase()}/api/v1/health` : "/api/v1/health (no base configured)"}</code></p>
      </div>

      <div className="tool-box" style={{ marginTop: 16 }}>
        <h2>Owner token</h2>
        <p>A token {getToken() ? "is present in this tab's session storage" : "is not stored"} (sessionStorage key <code>ct-admin-token</code>). The value itself is never displayed.</p>
        <label htmlFor="set-token">Change token (password)</label>
        <input id="set-token" className="input" type="password" autoComplete="off" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="Paste the new ADMIN_TOKEN value" />
        <div className="toolbar">
          <button type="button" className="btn" onClick={changeToken}>Change token</button>
          <button type="button" className="btn ghost" onClick={clear}>Clear token (lock dashboard)</button>
        </div>
        <p>Session storage only — the token is never written to localStorage, code, or logs, and is cleared when the tab closes.</p>
      </div>

      <div className="tool-box" style={{ marginTop: 16 }}>
        <h2>Search Console</h2>
        {!isWorkerConfigured() ? (
          <p><strong>NOT CONNECTED</strong> — Google OAuth credentials are not configured. See <Link to="/seo/search-console">Search Console</Link> for setup steps.</p>
        ) : gscError ? (
          <p>Status could not be read: {gscError}</p>
        ) : gsc ? (
          <p>{gsc.connected ? "Connected." : "Not connected."} {gsc.note || ""}</p>
        ) : (
          <p>Checking status…</p>
        )}
      </div>

      <div className="tool-box" style={{ marginTop: 16 }}>
        <h2>Documentation</h2>
        <p><Link to="/about">About CreatorToolbox</Link> · API documentation: <code>docs/api.md</code> in the repository (API reference for the Worker endpoints used by this dashboard).</p>
      </div>
    </SeoLayout>
  );
}
