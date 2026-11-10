import { useState } from "react";
import { useCopy } from "../shared.jsx";
const DAY = 24 * 60 * 60 * 1000;
const fmtDate = (d) => d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
export default function PregnancyCalculator() {
  const [lmp, setLmp] = useState("2026-01-01");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const calc = () => {
    if (!lmp) { setError("Pick the first day of your last menstrual period."); setResult(""); return; }
    const start = new Date(`${lmp}T00:00:00`);
    if (Number.isNaN(start.getTime())) { setError("Pick a valid date."); setResult(""); return; }
    const due = new Date(start.getTime() + 280 * DAY);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const daysPassed = Math.floor((today.getTime() - start.getTime()) / DAY);
    setError("");
    if (daysPassed < 0) {
      setResult(`Estimated due date: ${fmtDate(due)}\nThe date you entered is in the future — the due date is 280 days (40 weeks) after the first day of the last menstrual period.`);
    } else {
      const weeks = Math.floor(daysPassed / 7);
      const days = daysPassed % 7;
      setResult(`Estimated due date: ${fmtDate(due)}\nToday you are about ${weeks} weeks and ${days} days pregnant (week ${weeks + 1}).\nFormula: due date = first day of the last menstrual period + 280 days (40 weeks).`);
    }
  };
  return (
    <div>
      <p className="notice">Estimate only — not medical advice. The due date is an estimate from the last menstrual period; only a doctor or an ultrasound can confirm it. If anything worries you, see a doctor.</p>
      <label htmlFor="preg-lmp">First day of your last menstrual period</label>
      <input id="preg-lmp" className="input" type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Due Date</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: last menstrual period starting 1 January 2026 → estimated due date 8 October 2026 (280 days later).</p>
    </div>
  );
}
