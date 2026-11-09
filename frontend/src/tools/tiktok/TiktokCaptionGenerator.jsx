import { useState } from "react";
import { useCopy, TemplateNote, ResultList, Actions, checkLength } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

export default function TiktokCaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("casual");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const generate = () => {
    const err = checkLength(topic, 2, "Enter a topic of at least 2 characters.");
    if (err) { setError(err); setResults([]); return; }
    setError("");
    const t = topic.trim();
    const sets = {
      funny: [`POV: ${t} hits different today.`, `Nobody: … Me: ${t}.`, `${t} — I said what I said.`, `Tell me you love ${t} without telling me.`],
      casual: [`A little ${t} for your feed.`, `Today's vibe: ${t}.`, `${t} — save this for later.`, `Just a normal day of ${t}.`],
      informative: [`${t}: what actually works (save this).`, `3 things about ${t} you should know.`, `The honest truth about ${t}.`, `${t} explained in 30 seconds.`]
    };
    setResults(sets[tone]);
  };
  return (
    <div>
      <TemplateNote />
      <label htmlFor="tc-topic">Video topic</label>
      <input id="tc-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. morning coffee" />
      <label htmlFor="tc-tone">Tone</label>
      <select id="tc-tone" className="input" value={tone} onChange={(e) => setTone(e.target.value)}>
        <option value="funny">Funny</option><option value="casual">Casual</option><option value="informative">Informative</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={generate}>Generate Captions</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success" role="status">{msg}</p>}
      <ResultList items={results} onCopy={copy} />
      <Actions hasResult={results.length > 0} onCopyAll={() => copy(results.join("\n"))} onDownload={() => downloadText("tiktok-captions.txt", results.join("\n"))} onReset={() => { setTopic(""); setResults([]); setError(""); }} />
    </div>
  );
}
