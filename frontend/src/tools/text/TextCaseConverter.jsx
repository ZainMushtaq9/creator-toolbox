import { useState } from "react";
import { useCopy, Actions } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

function toTitle(s) { return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()); }
function toSentence(s) { return s.toLowerCase().replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (c) => c.toUpperCase()); }
function toAlternating(s) { let i = 0; return s.split("").map((c) => /[a-zA-Z]/.test(c) ? (i++ % 2 === 0 ? c.toLowerCase() : c.toUpperCase()) : c).join(""); }
const CASES = {
  upper: ["UPPERCASE", (s) => s.toUpperCase()],
  lower: ["lowercase", (s) => s.toLowerCase()],
  title: ["Title Case", toTitle],
  sentence: ["Sentence case", toSentence],
  capitalised: ["Capitalized Words", (s) => s.split(/\s+/).map((w) => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ")],
  alternating: ["aLtErNaTiNg", toAlternating]
};
export default function TextCaseConverter() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [activeCase, setActiveCase] = useState("");
  const { msg, copy } = useCopy();
  const convert = (key) => {
    if (!text.trim()) { setResult(""); setActiveCase(""); return; }
    setResult(CASES[key][1](text));
    setActiveCase(CASES[key][0]);
  };
  return (
    <div>
      <p className="notice info">Conversion runs locally in your browser. Your text is never uploaded or stored.</p>
      <label htmlFor="tcc-text">Your text</label>
      <textarea id="tcc-text" className="input" rows={8} value={text} onChange={(e) => { setText(e.target.value); setResult(""); }} placeholder="Paste or type your text here…" />
      <div className="toolbar" role="group" aria-label="Case options">
        {Object.entries(CASES).map(([k, [label]]) => (
          <button key={k} type="button" className="btn secondary" onClick={() => convert(k)}>{label}</button>
        ))}
      </div>
      {result && <div><p><strong>Result ({activeCase}):</strong></p><div className="output">{result}</div></div>}
      {msg && <p className="success">{msg}</p>}
      <Actions hasResult={!!result} onCopyAll={() => copy(result)} onDownload={() => downloadText("converted-text.txt", result)} onReset={() => { setText(""); setResult(""); setActiveCase(""); }} />
      <p>Title Case capitalises each word here. For formal titles, check your style guide — small words like “and” and “the” are often left lowercase.</p>
    </div>
  );
}
