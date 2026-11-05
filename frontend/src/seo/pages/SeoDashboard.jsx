import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SeoLayout, { SEO_MODULES } from "../components/SeoLayout.jsx";
import { apiMode, isWorkerConfigured, loadLocalReports, seoFetch } from "../seoApi.js";

// Owner-only SEO Intelligence dashboard.
// Summary cards are built ONLY from data that actually exists: the last
// audit and last keyword research saved in this browser
// (localStorage 'ct-seo-reports'), plus live GSC / AI status when a Worker
// is configured. Nothing here is demo data — when there is no data, the
// card says so plainly.
//
// The dashboard body lives in its own component (DashboardContent) so it
// only mounts AFTER the lock screen unlocks. SeoLayout renders children
// only when unlocked; if the mode were read in SeoDashboard itself, the
// value would be captured before unlocking (no token yet) and the cards
// would keep showing "Local (browser)" even in Worker mode.
export default function SeoDashboard() {
  return (
    <SeoLayout title="SEO Intelligence Dashboard" description="Owner-only SEO dashboard: audits, keyword research, Search Console and AI status." path="/seo">
      <DashboardContent />
    </SeoLayout>
  );
}

function DashboardContent() {
  const [reports, setReports] = useState([]);
  const [gsc, setGsc] = useState(null);
  const [gscError, setGscError] = useState("");
  const [aiMode, setAiMode] = useState("local — no AI provider connected");

  useEffect(() => {
    setReports(loadLocalReports());
    if (isWorkerConfigured()) {
      seoFetch("/api/v1/gsc/status")
        .then((d) => setGsc(d))
        .catch((e) => setGscError(e.message));
      seoFetch("/api/v1/ai/models")
        .then((d) => setAiMode(`Worker — provider ${d?.provider || "unknown"} (see AI page for mode)`))
        .catch(() => setAiMode("Worker configured, but /ai/models could not be reached"));
    }
  }, []);

  const lastAudit = reports.find((r) => r.type === "page-audit");
  const lastKeyword = reports.find((r) => r.type === "keyword-research");
  const mode = apiMode();

  return (
    <>
      <h1>SEO Intelligence</h1>
      <p className="lede">
        Owner-only dashboard. {mode === "worker"
          ? "Worker API is configured and unlocked — actions below may call the Worker."
          : "Running in LOCAL mode: every analysis runs deterministically in this browser. No Search Console or AI data exists until a Worker is configured and connected."}
      </p>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <article className="card">
          <h3>Last page audit</h3>
          {lastAudit ? (
            <p>Score <strong>{lastAudit.data?.score ?? "—"}/100</strong> for {lastAudit.data?.url || lastAudit.title} — saved {new Date(lastAudit.createdAt).toLocaleDateString()} (local report).</p>
          ) : (
            <p>No audit saved yet. Run one in <Link to="/seo/audit">Page Audit</Link> — {mode === "worker" ? "in Worker mode you can enter just the page URL and the Worker fetches it for you." : "local, no backend needed."}</p>
          )}
        </article>
        <article className="card">
          <h3>Last keyword research</h3>
          {lastKeyword ? (
            <p>Seed <strong>{lastKeyword.data?.keyword || lastKeyword.title}</strong> — {lastKeyword.data?.suggestions?.length ?? 0} suggestions, saved {new Date(lastKeyword.createdAt).toLocaleDateString()} (local report). Search volume: unavailable.</p>
          ) : (
            <p>No keyword research saved yet. Try <Link to="/seo/keywords">Keyword Research</Link>.</p>
          )}
        </article>
        <article className="card">
          <h3>Search Console</h3>
          {!isWorkerConfigured() ? (
            <p><strong>NOT CONNECTED</strong> — Google OAuth credentials are not configured. See <Link to="/seo/search-console">Search Console</Link> for setup steps. No clicks or impressions are shown because none exist.</p>
          ) : gscError ? (
            <p>Worker configured, but status could not be read: {gscError}</p>
          ) : gsc ? (
            <p>{gsc.connected ? "Connected" : "Not connected"} — {gsc.note || (gsc.configured ? "Credentials configured; OAuth flow not completed." : "OAuth credentials not configured.")}</p>
          ) : (
            <p>Checking status…</p>
          )}
        </article>
        <article className="card">
          <h3>AI mode</h3>
          <p>{aiMode}. In local mode AI recommendations are NOT faked — see <Link to="/seo/ai">AI Recommendations</Link>.</p>
        </article>
        <article className="card">
          <h3>API mode</h3>
          <p><strong>{mode === "worker" ? "Worker" : "Local (browser)"}</strong> — {mode === "worker" ? "VITE_API_URL is set and a token is present." : "VITE_API_URL is empty or no token is present, so all modules run their deterministic local engine."}</p>
        </article>
        <article className="card">
          <h3>Reports stored locally</h3>
          <p>{reports.length} report(s) in this browser (localStorage &lsquo;ct-seo-reports&rsquo;). {mode === "worker" ? "Reports saved here stay in this browser; page audits run via the Worker are also recorded in the Worker’s database." : "None are stored server-side in local mode."} <Link to="/seo/reports">View reports</Link>.</p>
        </article>
      </div>

      <h2 style={{ marginTop: 24 }}>Modules</h2>
      <div className="toolbar">
        {SEO_MODULES.filter((m) => m.path !== "/seo").map((m) => (
          <Link key={m.path} to={m.path} className="btn secondary btn-sm">{m.label}</Link>
        ))}
      </div>
      <p className="notice info">
        All scores on this dashboard are CreatorToolbox diagnostics computed from text you supply — not
        Google ranking data. Search volume, difficulty, rankings and traffic are never invented here.
      </p>
    </>
  );
}
