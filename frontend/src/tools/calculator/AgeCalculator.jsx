import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function AgeCalculator() {
  const [dob, setDob] = useState("2000-01-01");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const calc = () => {
    if (!dob) { setError("Pick your date of birth."); setResult(""); return; }
    const [y, m, d] = dob.split("-").map(Number);
    const birth = new Date(y, m - 1, d);
    if (Number.isNaN(birth.getTime()) || birth.getFullYear() !== y || birth.getMonth() !== m - 1 || birth.getDate() !== d) { setError("Enter a valid date of birth."); setResult(""); return; }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (birth > today) { setError("Date of birth cannot be in the future."); setResult(""); return; }
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) { months -= 1; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (months < 0) { years -= 1; months += 12; }
    const totalDays = Math.round((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(y, m - 1, d)) / 86400000);
    setError("");
    setResult(`Your age: ${years} years, ${months} months, ${days} days\nTotal days lived: ${totalDays.toLocaleString()}\nBorn ${birth.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} — leap years are handled by calendar math, so a 29 February birthday counts correctly.`);
  };
  return (
    <div>
      <p className="notice info">Exact age in years, months and days from your date of birth. Calculated locally in your browser; your date of birth is never uploaded or stored.</p>
      <label htmlFor="ac-dob">Date of birth</label>
      <input id="ac-dob" className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Age</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: born 1 January 2000, on 10 November 2026 you are 26 years, 10 months and 9 days old.</p>
    </div>
  );
}
