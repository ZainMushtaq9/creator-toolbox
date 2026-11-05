import { useState } from "react";
import { z } from "zod";
import { useCopy, TemplateNote, ResultList, Actions, hashtagBase } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

const GENERIC = ["#Instagram", "#InstaDaily", "#PhotoOfTheDay", "#ExplorePage"];
export default function InstagramHashtagGenerator() {
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
      <label htmlFor="ih-topic">Post topic</label>
      <input id="ih-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. travel photography" />
      <div className="toolbar"><button type="button" className="btn" onClick={generate}>Generate Hashtags</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success">{msg}</p>}
      <ResultList items={results} onCopy={copy} />
      {results.length > 0 && <p className="output">{results.join(" ")}</p>}
      <Actions hasResult={results.length > 0} onCopyAll={() => copy(results.join(" "))} onDownload={() => downloadText("instagram-hashtags.txt", results.join(" "))} onReset={() => { setTopic(""); setResults([]); setError(""); }} />
      <p className="notice">Instagram allows up to 30 hashtags per post; 5–15 relevant ones is a sensible range.</p>
    </div>
  );
}
