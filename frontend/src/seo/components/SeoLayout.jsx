import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import SeoHead from "../../components/SeoHead.jsx";
import { getToken, setToken, clearToken, isUnlocked } from "../auth.js";
import { apiMode, isWorkerConfigured } from "../seoApi.js";

export const SEO_MODULES = [
  { path: "/seo", label: "Dashboard" },
  { path: "/seo/keywords", label: "Keyword Research" },
  { path: "/seo/competitor", label: "Competitor Analysis" },
  { path: "/seo/audit", label: "Page Audit" },
  { path: "/seo/gaps", label: "Keyword Gap" },
  { path: "/seo/search-console", label: "Search Console" },
  { path: "/seo/aeo", label: "AEO" },
  { path: "/seo/gso", label: "GSO" },
  { path: "/seo/ai", label: "AI Recommendations" },
  { path: "/seo/reports", label: "Reports" },
  { path: "/seo/settings", label: "Settings" },
];

// Owner-only layout for the SEO Intelligence dashboard.
// Locked until an admin token is entered: the token is stored in
// sessionStorage only (this tab) and is never shown back or logged.
// In local mode (no Worker configured) there is no server to verify the
// token against — unlocking only opens the dashboard in this tab; Worker
// calls still require the token to match the server-side ADMIN_TOKEN.
export default function SeoLayout({ title, description, path, children }) {
  const [unlocked, setUnlocked] = useState(isUnlocked());
  const [tokenInput, setTokenInput] = useState("");
  const [lockMsg, setLockMsg] = useState("");

  const unlock = () => {
    if (!tokenInput.trim()) {
      setLockMsg("Enter the owner admin token to unlock the dashboard.");
      return;
    }
    setToken(tokenInput);
    setTokenInput("");
    setLockMsg("");
    setUnlocked(true);
  };

  const lock = () => {
    clearToken();
    setUnlocked(false);
  };

  if (!unlocked) {
    return (
      <div className="container section">
        <SeoHead title="SEO Intelligence — Owner Only" description="Owner-only SEO Intelligence dashboard. Locked until the admin token is entered." path="/seo" />
        <h1>SEO Intelligence — Locked</h1>
        <p className="notice">
          <strong>Owner-only dashboard.</strong> This area is for the site owner only. It is disallowed in
          robots.txt and protected by the admin token.
        </p>
        <div className="tool-box">
          <h2>Unlock with admin token</h2>
          <label htmlFor="seo-token">Admin token (password)</label>
          <input
            id="seo-token"
            className="input"
            type="password"
            autoComplete="off"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") unlock(); }}
            placeholder="Paste the ADMIN_TOKEN value"
          />
          <div className="toolbar">
            <button type="button" className="btn" onClick={unlock}>Unlock</button>
          </div>
          {lockMsg && <p className="error">{lockMsg}</p>}
          <p>
            The token is stored in this tab&rsquo;s session storage only and is cleared when the tab closes.
            It is never saved to local storage, code, or logs, and is never displayed back.
          </p>
          {!isWorkerConfigured() && (
            <p className="notice">
              No Worker API is configured (VITE_API_URL is empty), so the dashboard runs in <strong>local
              mode</strong>: all analysis runs deterministically in this browser. Unlocking here only opens
              the dashboard in this tab — there is no server-side token to verify against, and no token
              configured server-side means Worker-backed features stay unavailable until the Worker is
              deployed and configured.
            </p>
          )}
          {isWorkerConfigured() && (
            <p className="notice info">
              A Worker API is configured. The token you enter must match the server-side ADMIN_TOKEN, or
              Worker calls will be rejected (401).
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <SeoHead title={title} description={description} path={path} />
      <div className="toolbar" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0 }}>
          <strong>SEO Intelligence</strong> — owner only · API mode: <strong>{apiMode() === "worker" ? "Worker" : "Local (browser)"}</strong>
        </p>
        <button type="button" className="btn ghost btn-sm" onClick={lock}>Lock dashboard</button>
      </div>
      <nav aria-label="SEO modules" className="toolbar">
        {SEO_MODULES.map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            end={m.path === "/seo"}
            className={({ isActive }) => (isActive ? "btn btn-sm" : "btn secondary btn-sm")}
          >
            {m.label}
          </NavLink>
        ))}
        <Link to="/seo/experiments" className="btn ghost btn-sm">SEO Experiments</Link>
      </nav>
      {children}
    </div>
  );
}
