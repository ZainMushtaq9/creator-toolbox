import { useState } from "react";
import { z } from "zod";
import { useCopy, TemplateNote, ResultList, Actions, hashtagBase } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

const GENERIC = ["#TikTok", "#ForYou", "#FYP", "#Viral"];
export default function TiktokHashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const generate = () => {
    const r = z.string().trim().min(2, "Enter a topic of at least 2 characters.").safeParse(topic);
    if (!r.success) { setError(r.error.issues[0].message); setResults([]); return; }
    setError("");
    setResults([...hashtagBase(topic), ...GENERIC].slice(0, 10));
  };
  return (
    <div>
      <TemplateNote />
      <label htmlFor="thh-topic">Video topic</label>
      <input id="thh-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. easy recipes" />
      <div className="toolbar"><button type="button" className="btn" onClick={generate}>Generate Hashtags</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success">{msg}</p>}
      <ResultList items={results} onCopy={copy} />
      {results.length > 0 && <p className="output">{results.join(" ")}</p>}
      <Actions hasResult={results.length > 0} onCopyAll={() => copy(results.join(" "))} onDownload={() => downloadText("tiktok-hashtags.txt", results.join(" "))} onReset={() => { setTopic(""); setResults([]); setError(""); }} />
      <p className="notice">The generator shows 10 hashtags as a pool to choose from — copy at most 5 into your caption, since TikTok's composer caps a caption at 5 hashtags. 3–5 relevant hashtags per video is a good starting point.</p>
    </div>
  );
}
