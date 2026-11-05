import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { topicTemplates, hashtagBase } from "../tools/shared.jsx";
import { copyText, downloadText } from "../utils/format.js";

const STEPS = ["Topic", "Title", "Description", "Tags & Hashtags", "Thumbnail", "Quality Check"];

export default function YoutubeWorkflow() {
  const [topic, setTopic] = useState("");
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [checked, setChecked] = useState({ title: false, description: false, thumbnail: false, review: false });
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  const titles = useMemo(() => (topic.trim().length >= 2 ? [...topicTemplates(topic).howto, ...topicTemplates(topic).list].slice(0, 8) : []), [topic]);
  const tags = useMemo(() => {
    if (topic.trim().length < 2) return "";
    const k = topic.trim().toLowerCase();
    return [k, `${k} for beginners`, `${k} tips`, `how to ${k}`, `${k} tutorial`, `best ${k}`].join(", ");
  }, [topic]);
  const hashtags = useMemo(() => (topic.trim().length >= 2 ? [...hashtagBase(topic), "#YouTube", "#NewVideo"].slice(0, 8).join(" ") : ""), [topic]);

  const start = () => {
    if (topic.trim().length < 2) { setError("Enter a topic of at least 2 characters to start the workflow."); return; }
    setError(""); setStep(1);
  };
  const saveToWorkspace = () => {
    try {
      const raw = localStorage.getItem("ct-workspaces");
      const data = raw ? JSON.parse(raw) : { projects: [] };
      let project = data.projects.find((p) => p.name === "YouTube videos");
      if (!project) { project = { id: "yt-" + Date.now(), name: "YouTube videos", createdAt: new Date().toISOString(), items: [] }; data.projects.push(project); }
      project.items.push({ id: "item-" + Date.now(), kind: "youtube-workflow", topic: topic.trim(), title, description, tags, hashtags, savedAt: new Date().toISOString() });
      localStorage.setItem("ct-workspaces", JSON.stringify(data));
      setSaved("Saved to the “YouTube videos” project in your workspace (this browser only).");
    } catch { setSaved("Could not save — browser storage is unavailable."); }
  };
  const allChecked = Object.values(checked).every(Boolean);

  return (
    <div className="container section">
      <SeoHead title="YouTube Creator Workflow" description="One topic carried through title, description, tags and hashtags, thumbnail and a final quality check — then saved to your workspace." path="/workflows/youtube-creator" />
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Workflows", path: "/workflows" }, { name: "YouTube Creator Workflow", path: null }]} />
      <h1>YouTube Creator Workflow</h1>
      <p className="lede">Enter one topic. It is shared across every step — title, description, tags, hashtags and thumbnail — so you never retype it. Template-based, not AI.</p>
      <ol>
        {STEPS.map((s, i) => <li key={s} style={{ fontWeight: step === i ? 700 : 400 }}>{s}{step > i ? " ✓" : ""}</li>)}
      </ol>

      {step === 0 && (
        <div className="tool-box">
          <h2>Step 1 — Your topic</h2>
          <label htmlFor="wf-topic">Video topic or main keyword</label>
          <input id="wf-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. budget travel in Pakistan" />
          <div className="toolbar"><button type="button" className="btn" onClick={start}>Start Workflow</button></div>
          {error && <p className="error" role="alert">{error}</p>}
        </div>
      )}

      {step >= 1 && (
        <div className="tool-box">
          <h2>Step 2 — Pick a title</h2>
          <p>Topic: <strong>{topic}</strong> <button type="button" className="btn ghost btn-sm" onClick={() => setStep(0)}>Change topic</button></p>
          <ul className="result-list">
            {titles.map((t) => (
              <li key={t}><span>{t}</span><button type="button" className="btn btn-sm secondary" onClick={() => { setTitle(t); setStep(2); }}>Use this title</button></li>
            ))}
          </ul>
          <p>Or write your own: <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your title" /></p>
          <p>Full generator: <Link to="/tools/youtube-title-generator">YouTube Title Generator</Link></p>
          <div className="toolbar"><button type="button" className="btn" disabled={!title.trim()} onClick={() => setStep(2)}>Continue to Description →</button></div>
        </div>
      )}

      {step >= 2 && step !== 1 && (
        <div className="tool-box">
          <h2>Step {step === 2 ? "3" : "3 (edit)"} — Description</h2>
          <label htmlFor="wf-desc">Description (generated from your title and topic — edit freely)</label>
          <textarea id="wf-desc" className="input" rows={8} value={description || (title ? `${title}\n\nIn this video, I break down ${topic} — what works, what to avoid, and how to get started.\n\nLinks and resources:\n[Add your links here]\n\nIf this helped, subscribe for more videos about ${topic}.` : "")} onChange={(e) => setDescription(e.target.value)} />
          <p>Full generator: <Link to="/tools/youtube-description-generator">YouTube Description Generator</Link></p>
          <div className="toolbar"><button type="button" className="btn" onClick={() => setStep(3)}>Continue to Tags &amp; Hashtags →</button></div>
        </div>
      )}

      {step >= 3 && (
        <div className="tool-box">
          <h2>Step 4 — Tags &amp; hashtags</h2>
          <p><strong>Tags:</strong></p>
          <div className="output">{tags}</div>
          <div className="toolbar"><button type="button" className="btn secondary btn-sm" onClick={() => copyText(tags, () => {})}>Copy tags</button></div>
          <p><strong>Hashtags:</strong></p>
          <div className="output">{hashtags}</div>
          <div className="toolbar"><button type="button" className="btn secondary btn-sm" onClick={() => copyText(hashtags, () => {})}>Copy hashtags</button></div>
          <p>Full generators: <Link to="/tools/youtube-tag-generator">Tag Generator</Link> · <Link to="/tools/youtube-hashtag-generator">Hashtag Generator</Link></p>
          <div className="toolbar"><button type="button" className="btn" onClick={() => setStep(4)}>Continue to Thumbnail →</button></div>
        </div>
      )}

      {step >= 4 && (
        <div className="tool-box">
          <h2>Step 5 — Thumbnail (1280 × 720)</h2>
          <p>Resize your thumbnail image to exactly 1280 × 720 in the <Link to="/tools/youtube-thumbnail-resizer">YouTube Thumbnail Resizer</Link> (local, no upload), then come back here and tick the checklist.</p>
          <div className="toolbar"><button type="button" className="btn" onClick={() => setStep(5)}>Continue to Quality Check →</button></div>
        </div>
      )}

      {step >= 5 && (
        <div className="tool-box">
          <h2>Step 6 — Quality check &amp; save</h2>
          <p>Publishing checklist:</p>
          {[
            ["title", "Title selected — clear, under ~60 characters, honest about the video"],
            ["description", "Description written — first lines carry the topic, links replaced"],
            ["thumbnail", "Thumbnail finalized — 1280 × 720, readable at small size"],
            ["review", "Final review — title, description and thumbnail match the video"]
          ].map(([key, label]) => (
            <p key={key}><label><input type="checkbox" checked={checked[key]} onChange={(e) => setChecked({ ...checked, [key]: e.target.checked })} /> {label}</label></p>
          ))}
          {!allChecked && <p className="notice">Tick all four items before publishing. This checklist is a reminder, not a guarantee of views.</p>}
          <div className="toolbar">
            <button type="button" className="btn" onClick={saveToWorkspace}>Save to Workspace</button>
            <button type="button" className="btn secondary" onClick={() => downloadText("youtube-workflow.txt", `Topic: ${topic}\nTitle: ${title}\n\nDescription:\n${description}\n\nTags:\n${tags}\n\nHashtags:\n${hashtags}\n`)}>Download as Text</button>
            <button type="button" className="btn ghost" onClick={() => { setTopic(""); setTitle(""); setDescription(""); setStep(0); setChecked({ title: false, description: false, thumbnail: false, review: false }); setSaved(""); }}>Start a New Video</button>
          </div>
          {saved && <p className="success">{saved} <Link to="/workspaces">Open your workspace →</Link></p>}
        </div>
      )}
    </div>
  );
}
