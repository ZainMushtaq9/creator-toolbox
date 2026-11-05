import { useEffect, useState } from "react";
import SeoLayout from "../components/SeoLayout.jsx";
import { deleteLocalReport, isWorkerConfigured, loadLocalReports, seoFetch } from "../seoApi.js";

// Reports — from the Worker (/api/v1/reports) when configured, otherwise
// from this browser's localStorage ('ct-seo-reports'). Local reports are
// never claimed to be stored server-side. Deleting removes the report from
// whichever store it came from.
export default function Reports() {
  const [reports, setReports] = useState([]);
  const [source, setSource] = useState("local");
  const [stored, setStored] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [openId, setOpenId] = useState(null);

  const load = async () => {
    setError("");
    if (isWorkerConfigured()) {
      try {
        const d = await seoFetch("/api/v1/reports?limit=50");
        setReports(d.reports || []);
        setStored(d.stored);
        setSource("worker");
        return;
      } catch (e) {
        setError(`Worker reports could not be loaded (${e.message}). Showing local reports instead.`);
      }
    }
    setReports(loadLocalReports());
    setSource("local");
    setStored(null);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    setError(""); setMsg("");
    if (source === "worker") {
      try {
        await seoFetch(`/api/v1/reports/${id}`, { method: "DELETE" });
        setMsg("Report deleted from the Worker.");
      } catch (e) {
        setError(`Could not delete from the Worker (${e.message}). The local copy was not touched.`);
        return;
      }
    } else {
      deleteLocalReport(id);
      setMsg("Local report deleted from this browser.");
    }
    load();
  };

  return (
    <SeoLayout title="SEO Reports" description="Saved SEO reports — from the Worker when configured, otherwise local to this browser." path="/seo/reports">
      <h1>Reports</h1>
      <p className="lede">
        Source: <strong>{source === "worker" ? "Worker (server-side)" : "Local — this browser only (localStorage 'ct-seo-reports')"}</strong>.
        {source === "local" && " Local reports are NOT stored server-side."}
        {stored === false && " The Worker reports it has no database bound, so server-side storage is unavailable."}
      </p>
      {error && <p className="error">{error}</p>}
      {msg && <p className="success">{msg}</p>}
      <div className="toolbar"><button type="button" className="btn secondary btn-sm" onClick={load}>Reload reports</button></div>

      {reports.length === 0 ? (
        <p className="notice">No reports yet. Run a Page Audit, Keyword Research, Competitor Analysis, Keyword Gap, AEO or GSO check and save it as a report, or save an AI draft from the AI page.</p>
      ) : (
        reports.map((r) => {
          const data = r.report_data ?? r.data ?? null;
          const title = r.title || `${r.type || "report"}`;
          return (
            <article className="card" key={r.id} style={{ marginTop: 12 }}>
              <h3>{title}</h3>
              <p>Type: {r.type || "—"} · Created: {r.created_at || r.createdAt ? new Date(r.created_at || r.createdAt).toLocaleString() : "—"} · Status: {r.status || data?.status || "saved"}{r.source ? ` · Source: ${r.source}` : ""}</p>
              <div className="toolbar">
                <button type="button" className="btn secondary btn-sm" onClick={() => setOpenId(openId === r.id ? null : r.id)}>
                  {openId === r.id ? "Hide details" : "View details"}
                </button>
                <button type="button" className="btn ghost btn-sm" onClick={() => remove(r.id)}>Delete</button>
              </div>
              {openId === r.id && (
                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: ".85rem" }}>
                  {data ? JSON.stringify(data, null, 2) : "(No report data stored.)"}
                </pre>
              )}
            </article>
          );
        })
      )}
    </SeoLayout>
  );
}
