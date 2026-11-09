import { useState } from "react";
import { useCopy, TemplateNote, ResultList, Actions, checkLength } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

export default function TiktokHookGenerator() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("curiosity");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const generate = () => {
    const err = checkLength(topic, 2, "Enter a topic of at least 2 characters.");
    if (err) { setError(err); setResults([]); return; }
    setError("");
    const t = topic.trim();
    const sets = {
      curiosity: [`Nobody is talking about this ${t} trick…`, `I tried ${t} for 30 days — here's what happened.`, `The ${t} secret I wish I knew sooner.`, `Wait until you see what ${t} can do.`],
      bold: [`Stop doing ${t} like this.`, `You're doing ${t} wrong.`, `${t} will change everything — here's proof.`, `I said what I said: ${t} is overrated. Here's why.`],
      mistake: [`3 ${t} mistakes you're probably making.`, `The biggest ${t} mistake beginners make.`, `I wasted a year on ${t}. Don't do what I did.`, `Avoid this ${t} mistake at all costs.`]
    };
    setResults(sets[style]);
  };
  return (
    <div>
      <TemplateNote />
      <label htmlFor="th-topic">Video topic</label>
      <input id="th-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. budgeting" />
      <label htmlFor="th-style">Hook style</label>
      <select id="th-style" className="input" value={style} onChange={(e) => setStyle(e.target.value)}>
        <option value="curiosity">Curiosity</option><option value="bold">Bold claim</option><option value="mistake">Mistake</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={generate}>Generate Hooks</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success" role="status">{msg}</p>}
      <ResultList items={results} onCopy={copy} />
      <Actions hasResult={results.length > 0} onCopyAll={() => copy(results.join("\n"))} onDownload={() => downloadText("tiktok-hooks.txt", results.join("\n"))} onReset={() => { setTopic(""); setResults([]); setError(""); }} />
      <p className="notice">Say the hook in the first 3 seconds. A hook that overpromises and under-delivers hurts watch time.</p>
    </div>
  );
}
