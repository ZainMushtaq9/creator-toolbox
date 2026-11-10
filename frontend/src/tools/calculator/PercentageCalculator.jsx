import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function PercentageCalculator() {
  const [mode, setMode] = useState("of");
  const [a, setA] = useState("20");
  const [b, setB] = useState("250");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const labels = {
    of: ["Percentage (%)", "Value", "What is 20% of 250? → 50."],
    is: ["Part", "Whole", "50 is what % of 200? → 25%."],
    change: ["Old value", "New value", "80 to 100 is a 25% increase."]
  };
  const round = (n) => Number(n.toFixed(4));
  const calc = () => {
    const x = Number(a), y = Number(b);
    if (!Number.isFinite(x) || !Number.isFinite(y)) { setError("Enter numbers in both fields."); setResult(""); return; }
    if (mode === "of") {
      setError("");
      setResult(`${x}% of ${y} = ${round((x / 100) * y)}\nFormula: (percentage ÷ 100) × value.`);
      return;
    }
    if (mode === "is") {
      if (y === 0) { setError("The whole value cannot be zero."); setResult(""); return; }
      setError("");
      setResult(`${x} is ${round((x / y) * 100)}% of ${y}\nFormula: (part ÷ whole) × 100.`);
      return;
    }
    if (y === 0) { setError("The old value cannot be zero."); setResult(""); return; }
    const change = ((x - y) / Math.abs(y)) * 100;
    setError("");
    setResult(`Change from ${y} to ${x}: ${change >= 0 ? "+" : ""}${change.toFixed(2)}% ${change >= 0 ? "increase" : "decrease"}\nFormula: ((new value − old value) ÷ old value) × 100.`);
  };
  return (
    <div>
      <p className="notice info">Three modes: a percentage of a number, one number as a percentage of another, and percentage increase or decrease. Calculated locally; nothing is stored.</p>
      <label htmlFor="pc-mode">Calculation</label>
      <select id="pc-mode" className="input" value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="of">What is X% of Y?</option>
        <option value="is">X is what % of Y?</option>
        <option value="change">Percentage increase / decrease</option>
      </select>
      <label htmlFor="pc-a">{labels[mode][0]}</label>
      <input id="pc-a" className="input" type="number" value={a} onChange={(e) => setA(e.target.value)} />
      <label htmlFor="pc-b">{labels[mode][1]}</label>
      <input id="pc-b" className="input" type="number" value={b} onChange={(e) => setB(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Percentage</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: {labels[mode][2]}</p>
    </div>
  );
}
