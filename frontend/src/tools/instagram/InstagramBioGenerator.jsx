import { useState } from "react";
import { z } from "zod";
import { useCopy, TemplateNote, ResultList, Actions } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name or handle."),
  niche: z.string().trim().min(2, "Enter your niche (at least 2 characters).")
});
export default function InstagramBioGenerator() {
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [vibe, setVibe] = useState("clean");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const generate = () => {
    const r = schema.safeParse({ name, niche });
    if (!r.success) { setError(r.error.issues[0].message); setResults([]); return; }
    setError("");
    const n = name.trim(), c = niche.trim();
    const sets = {
      clean: [`${n} | ${c}`, `${c} — by ${n}`, `${n}\n${c}\nNew here? Start below.`],
      creative: [`Making ${c} feel like magic | ${n}`, `${n} — turning ${c} into stories`, `Part-time dreamer, full-time ${c} | ${n}`],
      professional: [`${n} | ${c} | DM to work together`, `Helping you with ${c} | ${n}`, `${n} — ${c} specialist | Enquiries open`]
    };
    setResults(sets[vibe].map((b) => (b.length > 150 ? b.slice(0, 147) + "…" : b)));
  };
  return (
    <div>
      <TemplateNote />
      <label htmlFor="ib-name">Name or handle</label>
      <input id="ib-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Zain" />
      <label htmlFor="ib-niche">Niche</label>
      <input id="ib-niche" className="input" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. food blogger" />
      <label htmlFor="ib-vibe">Vibe</label>
      <select id="ib-vibe" className="input" value={vibe} onChange={(e) => setVibe(e.target.value)}>
        <option value="clean">Clean</option><option value="creative">Creative</option><option value="professional">Professional</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={generate}>Generate Bios</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success">{msg}</p>}
      <ResultList items={results} onCopy={copy} />
      <Actions hasResult={results.length > 0} onCopyAll={() => copy(results.join("\n\n"))} onDownload={() => downloadText("instagram-bios.txt", results.join("\n\n"))} onReset={() => { setName(""); setNiche(""); setResults([]); setError(""); }} />
      <p className="notice">Instagram bios are limited to 150 characters. Generated bios aim to stay under that limit.</p>
    </div>
  );
}
