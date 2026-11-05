import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead.jsx";
import { downloadText } from "../utils/format.js";

const KEY = "ct-workspaces";
function load() {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : { projects: [] }; }
  catch { return { projects: [] }; }
}

export default function Workspaces() {
  const [data, setData] = useState({ projects: [] });
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [projectId, setProjectId] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => { setData(load()); }, []);
  const persist = (next) => { setData(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { setMsg("Browser storage is unavailable."); } };
  const createProject = () => {
    if (!name.trim()) { setMsg("Enter a project name first."); return; }
    const project = { id: "p-" + Date.now(), name: name.trim(), createdAt: new Date().toISOString(), items: [] };
    persist({ projects: [...data.projects, project] });
    setName(""); setProjectId(project.id); setMsg(`Project “${project.name}” created.`);
  };
  const addNote = () => {
    if (!projectId) { setMsg("Create or select a project first."); return; }
    if (!text.trim()) { setMsg("Enter some text to save."); return; }
    const next = { projects: data.projects.map((p) => (p.id === projectId ? { ...p, items: [...p.items, { id: "item-" + Date.now(), kind: "note", text: text.trim(), savedAt: new Date().toISOString() }] } : p)) };
    persist(next); setText(""); setMsg("Saved to the project.");
  };
  const deleteItem = (pid, iid) => {
    persist({ projects: data.projects.map((p) => (p.id === pid ? { ...p, items: p.items.filter((i) => i.id !== iid) } : p)) });
  };
  const deleteProject = (pid) => {
    persist({ projects: data.projects.filter((p) => p.id !== pid) });
    if (projectId === pid) setProjectId("");
  };
  const exportProject = (p) => {
    downloadText(`${p.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-workspace.json`, JSON.stringify(p, null, 2), "application/json");
  };
  return (
    <div className="container section">
      <SeoHead title="Workspaces — Save Your Work" description="Save generated results into projects on your own device. No signup, no account sync — browser local storage only." path="/workspaces" />
      <h1>Workspaces</h1>
      <p className="lede">Save tool results into projects — on your device, in your browser. <strong>No signup, no account, no sync yet.</strong> Clearing browser data removes workspaces. Export a project as JSON to keep a copy.</p>
      <div className="tool-box">
        <h2>Create a project</h2>
        <label htmlFor="ws-name">Project name</label>
        <input id="ws-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. YouTube videos" />
        <div className="toolbar"><button type="button" className="btn" onClick={createProject}>Create Project</button></div>
        {msg && <p className="success">{msg}</p>}
      </div>
      {data.projects.length === 0 && (
        <p className="notice info">No projects yet. Create one above, or finish the <Link to="/workflows/youtube-creator">YouTube Creator Workflow</Link> and save it — it creates a “YouTube videos” project automatically.</p>
      )}
      {data.projects.map((p) => (
        <article className="card" key={p.id} style={{ marginTop: 16 }}>
          <h3>{p.name}</h3>
          <p>Created {new Date(p.createdAt).toLocaleDateString()} · {p.items.length} item(s)</p>
          <h4>Publishing checklist</h4>
          <ul>
            <li>Title selected</li>
            <li>Description written</li>
            <li>Thumbnail finalized (1280 × 720)</li>
            <li>Final review done</li>
          </ul>
          {p.items.map((it) => (
            <div key={it.id} className="output">
              <strong>{it.kind === "youtube-workflow" ? `YouTube workflow: ${it.topic}` : "Saved note"}</strong>
              {it.title && <><br />Title: {it.title}</>}
              {it.description && <><br />Description: {it.description.slice(0, 200)}{it.description.length > 200 ? "…" : ""}</>}
              {it.tags && <><br />Tags: {it.tags}</>}
              {it.text && <><br />{it.text}</>}
              <br /><small>Saved {new Date(it.savedAt).toLocaleString()}</small>
              {" "}<button type="button" className="btn ghost btn-sm" onClick={() => deleteItem(p.id, it.id)}>Delete</button>
            </div>
          ))}
          <div className="toolbar">
            <button type="button" className="btn secondary btn-sm" onClick={() => exportProject(p)}>Export Project (JSON)</button>
            <button type="button" className="btn ghost btn-sm" onClick={() => deleteProject(p.id)}>Delete Project</button>
          </div>
        </article>
      ))}
      {data.projects.length > 0 && (
        <div className="tool-box" style={{ marginTop: 16 }}>
          <h2>Add a note to a project</h2>
          <label htmlFor="ws-project">Project</label>
          <select id="ws-project" className="input" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">Select a project…</option>
            {data.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <label htmlFor="ws-text">Text to save</label>
          <textarea id="ws-text" className="input" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a generated title, caption or note…" />
          <div className="toolbar"><button type="button" className="btn" onClick={addNote}>Save to Project</button></div>
        </div>
      )}
    </div>
  );
}
