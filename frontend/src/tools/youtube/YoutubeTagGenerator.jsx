import { useState } from "react";
import { z } from "zod";
import { useCopy, TemplateNote, Actions } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

export default function YoutubeTagGenerator() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const generate = () => {
    const r = z.string().trim().min(2, "Enter a keyword of at least 2 characters.").safeParse(keyword);
    if (!r.success) { setError(r.error.issues[0].message); setResult(""); return; }
    setError("");
    const k = keyword.trim().toLowerCase();
    const tags = [k, `${k} for beginners`, `${k} tips`, `how to ${k}`, `${k} tutorial`, `best ${k}`, `${k} 2026`, `learn ${k}`, `${k} guide`, `${k} explained`];
    setResult([...new Set(tags)].join(", "));
  };
  return (
    <div>
      <TemplateNote />
      <label htmlFor="ytag-kw">Main keyword</label>
      <input id="ytag-kw" className="input" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. drone photography" />
      <div className="toolbar"><button type="button" className="btn" onClick={generate}>Generate Tags</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success">{msg}</p>}
      {result && <div className="output">{result}</div>}
      <Actions hasResult={!!result} onCopyAll={() => copy(result)} onDownload={() => downloadText("youtube-tags.txt", result)} onReset={() => { setKeyword(""); setResult(""); setError(""); }} />
      <p className="notice">Tags play a small role on YouTube. A focused set of 10–20 relevant tags is enough — stuffing hundreds does not help.</p>
    </div>
  );
}
