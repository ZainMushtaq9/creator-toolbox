import { useState } from "react";
import { z } from "zod";
import { useCopy, TemplateNote, ResultList, Actions } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

export default function InstagramCaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [mood, setMood] = useState("aesthetic");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const generate = () => {
    const r = z.string().trim().min(2, "Enter a topic of at least 2 characters.").safeParse(topic);
    if (!r.success) { setError(r.error.issues[0].message); setResults([]); return; }
    setError("");
    const t = topic.trim();
    const sets = {
      aesthetic: [`Chasing light, collecting moments. ${t}`, `Golden hour and ${t} — my favourite combination.`, `Less noise, more ${t}.`, `A quiet moment with ${t}.`],
      funny: [`Me: I'll just enjoy ${t}. Also me: takes 47 photos.`, `${t} — because adulting can wait.`, `Warning: ${t} may cause sudden happiness.`, `I came for ${t}. I stayed for the snacks.`],
      motivational: [`Small steps. Every single day. ${t}`, `Your ${t} journey starts with one decision.`, `Progress, not perfection — ${t} edition.`, `Show up for ${t}. Future you says thanks.`],
      minimal: [`${t}.`, `Today: ${t}.`, `${t} — enough said.`, `Simply ${t}.`]
    };
    setResults(sets[mood]);
  };
  return (
    <div>
      <TemplateNote />
      <label htmlFor="ic-topic">Post topic</label>
      <input id="ic-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. golden hour photo" />
      <label htmlFor="ic-mood">Mood</label>
      <select id="ic-mood" className="input" value={mood} onChange={(e) => setMood(e.target.value)}>
        <option value="aesthetic">Aesthetic</option><option value="funny">Funny</option>
        <option value="motivational">Motivational</option><option value="minimal">Minimal</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={generate}>Generate Captions</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success">{msg}</p>}
      <ResultList items={results} onCopy={copy} />
      <Actions hasResult={results.length > 0} onCopyAll={() => copy(results.join("\n"))} onDownload={() => downloadText("instagram-captions.txt", results.join("\n"))} onReset={() => { setTopic(""); setResults([]); setError(""); }} />
    </div>
  );
}
