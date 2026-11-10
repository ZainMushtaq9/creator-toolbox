import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("5");
  const [frequency, setFrequency] = useState("12");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calc = () => {
    const p = Number(principal), annual = Number(rate), yrs = Number(years), n = Number(frequency);
    if (!Number.isFinite(p) || !Number.isFinite(annual) || !Number.isFinite(yrs) || p <= 0 || annual < 0 || yrs <= 0 || n <= 0) { setError("Enter a principal and years above zero, and a rate and compounding frequency of zero or more."); setResult(""); return; }
    const r = annual / 100;
    const amount = p * Math.pow(1 + r / n, n * yrs);
    setError("");
    setResult(`Final amount: ${fmt(amount)}\nTotal interest earned: ${fmt(amount - p)}\nFormula: A = P × (1 + r/n)^(n×t), where P = ${fmt(p)}, r = ${annual}% = ${(r).toFixed(4)}, n = ${n} times a year, t = ${yrs} years.`);
  };
  return (
    <div>
      <p className="notice">Estimate only — not financial advice. Real returns vary, and no investment guarantees a fixed rate.</p>
      <label htmlFor="ci-principal">Principal amount</label>
      <input id="ci-principal" className="input" type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
      <label htmlFor="ci-rate">Annual interest / return rate (%)</label>
      <input id="ci-rate" className="input" type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
      <label htmlFor="ci-years">Years</label>
      <input id="ci-years" className="input" type="number" min="0" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} />
      <label htmlFor="ci-frequency">Compounding frequency</label>
      <select id="ci-frequency" className="input" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
        <option value="1">Yearly</option>
        <option value="2">Half-yearly</option>
        <option value="4">Quarterly</option>
        <option value="12">Monthly</option>
        <option value="365">Daily</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Compound Interest</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: 100,000 at 10% a year, compounded monthly for 5 years → about 164,530.89, of which about 64,530.89 is interest. Compounding more often earns slightly more.</p>
    </div>
  );
}
