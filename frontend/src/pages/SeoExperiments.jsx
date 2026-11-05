import { useState, useEffect } from "react";
import SeoHead from "../components/SeoHead.jsx";

const KEY = "ct-seo-experiments";
function load() {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
// MVP experiment tracker. Stores YOUR OWN notes locally. It does NOT fetch
// Search Console data and contains NO invented clicks, impressions or positions.
export default function SeoExperiments() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ page: "", change: "", date: "", clicks: "", impressions: "", ctr: "", position: "" });
  const [after, setAfter] = useState({});
  const [msg, setMsg] = useState("");
  useEffect(() => { setItems(load()); }, []);
  const persist = (next) => { setItems(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { setMsg("Browser storage is unavailable."); } };
  const add = () => {
    if (!form.page.trim() || !form.change.trim() || !form.date) { setMsg("Enter a page, the change you made, and the date."); return; }
    const exp = { id: "exp-" + Date.now(), ...form, createdAt: new Date().toISOString(), after28: null };
    persist([exp, ...items]);
    setForm({ page: "", change: "", date: "", clicks: "", impressions: "", ctr: "", position: "" });
    setMsg("Experiment saved locally. Compare again after 28 days — enter your own Search Console numbers; nothing here is fetched automatically.");
  };
  const saveAfter = (id) => {
    const a = after[id] || {};
    if (!a.clicks && !a.impressions && !a.ctr && !a.position) { setMsg("Enter at least one after-28-days value from your own Search Console data."); return; }
    persist(items.map((it) => (it.id === id ? { ...it, after28: a } : it)));
    setMsg("After-28-days values saved.");
  };
  const removeExp = (id) => persist(items.filter((it) => it.id !== id));
  return (
    <div className="container section">
      <SeoHead title="SEO Experiments — Planned / MVP Tracker" description="Track SEO changes on your own pages: baseline vs after 28 days, using your own Search Console numbers. No data is fetched automatically." path="/seo/experiments" />
      <h1>SEO Experiments</h1>
      <p className="notice"><strong>Planned / MVP:</strong> this is a manual tracker for the site owner. It stores your own notes in this browser only. It does <strong>not</strong> connect to Search Console and does <strong>not</strong> contain any Search Console data — enter numbers yourself from Search Console after 28 days.</p>
      <div className="tool-box">
        <h2>New experiment</h2>
        <label htmlFor="se-page">Page (URL path, e.g. /tools/image-compressor)</label>
        <input id="se-page" className="input" value={form.page} onChange={(e) => setForm({ ...form, page: e.target.value })} />
        <label htmlFor="se-change">Change made</label>
        <input id="se-change" className="input" value={form.change} onChange={(e) => setForm({ ...form, change: e.target.value })} placeholder="e.g. rewrote title and H1" />
        <label htmlFor="se-date">Date of change</label>
        <input id="se-date" className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <h3>Baseline (your own Search Console numbers, before the change)</h3>
        <label htmlFor="se-clicks">Clicks</label>
        <input id="se-clicks" className="input" type="number" min="0" value={form.clicks} onChange={(e) => setForm({ ...form, clicks: e.target.value })} />
        <label htmlFor="se-impr">Impressions</label>
        <input id="se-impr" className="input" type="number" min="0" value={form.impressions} onChange={(e) => setForm({ ...form, impressions: e.target.value })} />
        <label htmlFor="se-ctr">CTR (%)</label>
        <input id="se-ctr" className="input" type="number" min="0" step="0.01" value={form.ctr} onChange={(e) => setForm({ ...form, ctr: e.target.value })} />
        <label htmlFor="se-pos">Average position</label>
        <input id="se-pos" className="input" type="number" min="0" step="0.1" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
        <div className="toolbar"><button type="button" className="btn" onClick={add}>Save Experiment</button></div>
        {msg && <p className="success">{msg}</p>}
      </div>
      {items.map((it) => (
        <article className="card" key={it.id} style={{ marginTop: 16 }}>
          <h3>{it.page} — {it.change}</h3>
          <p>Changed: {it.date}</p>
          <p><strong>Baseline:</strong> clicks {it.clicks || "—"} · impressions {it.impressions || "—"} · CTR {it.ctr || "—"}% · position {it.position || "—"}</p>
          {it.after28
            ? <p><strong>After 28 days:</strong> clicks {it.after28.clicks || "—"} · impressions {it.after28.impressions || "—"} · CTR {it.after28.ctr || "—"}% · position {it.after28.position || "—"}</p>
            : (
              <div>
                <p>After 28 days — enter your own Search Console numbers:</p>
                <div className="toolbar">
                  <input className="input" style={{ maxWidth: 120 }} type="number" min="0" placeholder="Clicks" value={(after[it.id] || {}).clicks || ""} onChange={(e) => setAfter({ ...after, [it.id]: { ...(after[it.id] || {}), clicks: e.target.value } })} />
                  <input className="input" style={{ maxWidth: 140 }} type="number" min="0" placeholder="Impressions" value={(after[it.id] || {}).impressions || ""} onChange={(e) => setAfter({ ...after, [it.id]: { ...(after[it.id] || {}), impressions: e.target.value } })} />
                  <input className="input" style={{ maxWidth: 110 }} type="number" min="0" step="0.01" placeholder="CTR %" value={(after[it.id] || {}).ctr || ""} onChange={(e) => setAfter({ ...after, [it.id]: { ...(after[it.id] || {}), ctr: e.target.value } })} />
                  <input className="input" style={{ maxWidth: 130 }} type="number" min="0" step="0.1" placeholder="Position" value={(after[it.id] || {}).position || ""} onChange={(e) => setAfter({ ...after, [it.id]: { ...(after[it.id] || {}), position: e.target.value } })} />
                  <button type="button" className="btn btn-sm" onClick={() => saveAfter(it.id)}>Save After-28-Days</button>
                </div>
              </div>
            )}
          <button type="button" className="btn ghost btn-sm" onClick={() => removeExp(it.id)}>Delete</button>
        </article>
      ))}
    </div>
  );
}
