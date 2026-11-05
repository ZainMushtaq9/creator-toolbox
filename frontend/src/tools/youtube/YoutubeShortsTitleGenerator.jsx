import { useState } from "react";
import { z } from "zod";
import { useCopy, TemplateNote, ResultList, Actions } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

export default function YoutubeShortsTitleGenerator() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("hook");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const generate = () => {
    const r = z.string().trim().min(2, "Enter a topic of at least 2 characters.").safeParse(topic);
    if (!r.success) { setError(r.error.issues[0].message); setResults([]); return; }
    setError("");
    const t = topic.trim();
    const sets = {
      hook: [`Stop Doing This With ${t}`, `${t} in 30 Seconds?`, `Nobody Tells You This About ${t}`, `Wait… ${t} Actually Works?`],
      howto: [`${t} in 3 Easy Steps`, `How to Start ${t} Today`, `${t} for Beginners (60 Seconds)`, `Learn ${t} Fast`],
      curiosity: [`I Tried ${t} for 7 Days`, `${t}: Expectation vs Reality`, `The ${t} Trick That Saves Time`, `Why ${t} Is Going Viral`]
    };
    setResults(sets[style]);
  };
  return (
    <div>
      <TemplateNote />
      <label htmlFor="ys-topic">Shorts topic</label>
      <input id="ys-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. 30-second pasta" />
      <label htmlFor="ys-style">Style</label>
      <select id="ys-style" className="input" value={style} onChange={(e) => setStyle(e.target.value)}>
        <option value="hook">Hook</option><option value="howto">How-to</option><option value="curiosity">Curiosity</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={generate}>Generate Titles</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success">{msg}</p>}
      <ResultList items={results} onCopy={copy} />
      <Actions hasResult={results.length > 0} onCopyAll={() => copy(results.join("\n"))} onDownload={() => downloadText("shorts-titles.txt", results.join("\n"))} onReset={() => { setTopic(""); setResults([]); setError(""); }} />
      <p className="notice">Aim for under 60 characters so the title is fully visible on a phone screen.</p>
    </div>
  );
}
