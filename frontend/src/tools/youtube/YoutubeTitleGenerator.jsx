import { useState } from "react";
import { z } from "zod";
import { useCopy, TemplateNote, ResultList, Actions, topicTemplates } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

const schema = z.object({ topic: z.string().trim().min(2, "Enter a topic of at least 2 characters.").max(100) });
export default function YoutubeTitleGenerator() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("howto");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const generate = () => {
    const r = schema.safeParse({ topic });
    if (!r.success) { setError(r.error.issues[0].message); setResults([]); return; }
    setError("");
    setResults(topicTemplates(topic)[style]);
  };
  return (
    <div>
      <TemplateNote />
      <label htmlFor="yt-topic">Video topic or main keyword</label>
      <input id="yt-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. budget travel in Pakistan" />
      <label htmlFor="yt-style">Title style</label>
      <select id="yt-style" className="input" value={style} onChange={(e) => setStyle(e.target.value)}>
        <option value="howto">How-to</option><option value="list">List</option>
        <option value="curiosity">Curiosity</option><option value="question">Question</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={generate}>Generate Titles</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success">{msg}</p>}
      <ResultList items={results} onCopy={copy} />
      <Actions hasResult={results.length > 0} onCopyAll={() => copy(results.join("\n"))} onDownload={() => downloadText("youtube-titles.txt", results.join("\n"))} onReset={() => { setTopic(""); setResults([]); setError(""); }} />
      <p className="notice">Tip: keep titles under 60 characters where possible so they are not cut off on phones.</p>
    </div>
  );
}
