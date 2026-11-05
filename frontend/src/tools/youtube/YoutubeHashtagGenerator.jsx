import { useState } from "react";
import { z } from "zod";
import { useCopy, TemplateNote, ResultList, Actions, hashtagBase } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

const GENERIC = ["#YouTube", "#Video", "#Subscribe", "#NewVideo"];
export default function YoutubeHashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const generate = () => {
    const r = z.string().trim().min(2, "Enter a topic of at least 2 characters.").safeParse(topic);
    if (!r.success) { setError(r.error.issues[0].message); setResults([]); return; }
    setError("");
    setResults([...hashtagBase(topic), ...GENERIC].slice(0, 12));
  };
  return (
    <div>
      <TemplateNote />
      <label htmlFor="yh-topic">Video topic</label>
      <input id="yh-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. home workout" />
      <div className="toolbar"><button type="button" className="btn" onClick={generate}>Generate Hashtags</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success">{msg}</p>}
      <ResultList items={results} onCopy={copy} />
      {results.length > 0 && <p className="output">{results.join(" ")}</p>}
      <Actions hasResult={results.length > 0} onCopyAll={() => copy(results.join(" "))} onDownload={() => downloadText("youtube-hashtags.txt", results.join(" "))} onReset={() => { setTopic(""); setResults([]); setError(""); }} />
      <p className="notice">YouTube allows up to 15 hashtags per video. 3–8 relevant ones is usually enough.</p>
    </div>
  );
}
