import { useEffect, useState } from "react";
import SeoLayout from "../components/SeoLayout.jsx";
import { apiBase, isWorkerConfigured, seoFetch } from "../seoApi.js";

// Google Search Console — first-party data for the owner's own property only.
// With no Worker configured, or no OAuth credentials on the Worker, this
// page says NOT CONNECTED and shows setup steps. Clicks / impressions /
// positions are shown ONLY from stored metrics after a real sync — never
// invented.
export default function SearchConsole() {
  const [status, setStatus] = useState(null);
  const [statusError, setStatusError] = useState("");
  const [properties, setProperties] = useState(null);
  const [rows, setRows] = useState(null);
  const [sync, setSync] = useState({ siteUrl: "", startDate: "", endDate: "" });
  const [perf, setPerf] = useState({ siteUrl: "", startDate: "", endDate: "" });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isWorkerConfigured()) return;
    seoFetch("/api/v1/gsc/status")
      .then((d) => setStatus(d))
      .catch((e) => setStatusError(e.message));
  }, []);

  const loadProperties = async () => {
    setError(""); setBusy(true);
    try {
      const d = await seoFetch("/api/v1/gsc/properties");
      setProperties(d.sites || []);
      setMsg("Properties loaded from Search Console.");
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const connect = async () => {
    setError(""); setBusy(true);
    try {
      const redirectUri = `${apiBase()}/api/v1/gsc/callback`;
      const d = await seoFetch(`/api/v1/gsc/connect?redirectUri=${encodeURIComponent(redirectUri)}`);
      if (d.authUrl) {
        window.location.href = d.authUrl;
      } else {
        setError("Worker did not return an auth URL.");
      }
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const runSync = async () => {
    if (!sync.siteUrl.trim() || !sync.startDate || !sync.endDate) { setError("Enter a site URL, start date and end date for the sync."); return; }
    setError(""); setMsg(""); setBusy(true);
    try {
      const d = await seoFetch("/api/v1/gsc/sync", { method: "POST", body: sync });
      setMsg(`Sync complete: ${d.rowsStored ?? 0} row(s) stored for ${d.siteUrl}. ${d.note || ""}`);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const loadPerformance = async () => {
    setError(""); setBusy(true);
    try {
      const q = new URLSearchParams(perf).toString();
      const d = await seoFetch(`/api/v1/gsc/performance?${q}`);
      setRows(d.rows || []);
      setMsg(d.note || "");
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <SeoLayout title="Search Console" description="Google Search Console connection, sync and stored performance for the owner's own property." path="/seo/search-console">
      <h1>Search Console</h1>

      {!isWorkerConfigured() ? (
        <div className="tool-box">
          <h2>NOT CONNECTED — Google OAuth credentials are not configured</h2>
          <p>No Search Console data exists here. No clicks, impressions or positions are shown because none have been fetched — they are never invented.</p>
          <h3>Setup steps</h3>
          <ol>
            <li>Create a Google Cloud OAuth client (web application) for the CreatorToolbox project.</li>
            <li>Set the redirect URI to <code>https://&lt;worker&gt;/api/v1/gsc/callback</code> (replace <code>&lt;worker&gt;</code> with the deployed Worker host).</li>
            <li>Set the Worker secrets <code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code> and <code>OAUTH_ENCRYPTION_KEY</code>.</li>
            <li>Deploy the Worker with <code>VITE_API_URL</code> pointing at it, unlock this dashboard, and return here to Connect.</li>
          </ol>
          <p>Scope is read-only: <code>https://www.googleapis.com/auth/webmasters.readonly</code>. Only the owner&rsquo;s own verified properties are ever accessed.</p>
        </div>
      ) : (
        <>
          <p className="notice info">
            Worker configured. {statusError ? `Status could not be read: ${statusError}` : status ? (status.connected ? "Connected." : "Not connected.") : "Checking status…"}
            {status?.note ? ` ${status.note}` : ""}
            {status?.propertyUrl ? ` Property: ${status.propertyUrl}.` : ""}
          </p>
          <div className="tool-box">
            <h2>Connect</h2>
            <p>Starts the Google OAuth flow (read-only scope). Google returns to the Worker callback, which stores the token encrypted.</p>
            <div className="toolbar">
              <button type="button" className="btn" onClick={connect} disabled={busy}>Connect Search Console</button>
              <button type="button" className="btn secondary" onClick={loadProperties} disabled={busy}>List properties</button>
            </div>
            {error && <p className="error">{error}</p>}
            {msg && <p className="success" role="status">{msg}</p>}
          </div>

          {properties && (
            <div style={{ marginTop: 16 }}>
              <h2>Properties ({properties.length})</h2>
              {properties.length === 0 ? <p>No verified properties returned for this account.</p> : (
                <ul>{properties.map((p, i) => <li key={i}>{p.siteUrl || JSON.stringify(p)}</li>)}</ul>
              )}
            </div>
          )}

          <div className="tool-box" style={{ marginTop: 16 }}>
            <h2>Sync metrics</h2>
            <label htmlFor="gsc-site">Site URL (property)</label>
            <input id="gsc-site" className="input" value={sync.siteUrl} onChange={(e) => setSync({ ...sync, siteUrl: e.target.value })} placeholder="sc-domain:example.com or https://example.com/" />
            <label htmlFor="gsc-start">Start date</label>
            <input id="gsc-start" className="input" type="date" value={sync.startDate} onChange={(e) => setSync({ ...sync, startDate: e.target.value })} />
            <label htmlFor="gsc-end">End date</label>
            <input id="gsc-end" className="input" type="date" value={sync.endDate} onChange={(e) => setSync({ ...sync, endDate: e.target.value })} />
            <div className="toolbar"><button type="button" className="btn" onClick={runSync} disabled={busy}>Sync from Search Console</button></div>
          </div>

          <div className="tool-box" style={{ marginTop: 16 }}>
            <h2>Stored performance</h2>
            <p>Reads metrics previously synced into the Worker database. No data exists until a sync has run.</p>
            <label htmlFor="gsc-p-site">Site URL (optional filter)</label>
            <input id="gsc-p-site" className="input" value={perf.siteUrl} onChange={(e) => setPerf({ ...perf, siteUrl: e.target.value })} />
            <label htmlFor="gsc-p-start">Start date</label>
            <input id="gsc-p-start" className="input" type="date" value={perf.startDate} onChange={(e) => setPerf({ ...perf, startDate: e.target.value })} />
            <label htmlFor="gsc-p-end">End date</label>
            <input id="gsc-p-end" className="input" type="date" value={perf.endDate} onChange={(e) => setPerf({ ...perf, endDate: e.target.value })} />
            <div className="toolbar"><button type="button" className="btn" onClick={loadPerformance} disabled={busy}>Load stored performance</button></div>
            {rows && (
              rows.length === 0 ? <p>No stored metrics match. Run a sync first.</p> : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
                  <thead><tr><th style={{ textAlign: "left" }}>Date</th><th style={{ textAlign: "left" }}>Page</th><th style={{ textAlign: "left" }}>Query</th><th style={{ textAlign: "left" }}>Clicks</th><th style={{ textAlign: "left" }}>Impressions</th><th style={{ textAlign: "left" }}>CTR</th><th style={{ textAlign: "left" }}>Position</th></tr></thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}><td>{r.date}</td><td>{r.page}</td><td>{r.query}</td><td>{r.clicks}</td><td>{r.impressions}</td><td>{r.ctr}</td><td>{r.position}</td></tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </>
      )}
    </SeoLayout>
  );
}
