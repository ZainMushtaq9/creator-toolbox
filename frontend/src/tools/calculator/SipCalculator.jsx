import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function SipCalculator() {
  const [monthly, setMonthly] = useState("10000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calc = () => {
    const p = Number(monthly), annual = Number(rate), yrs = Number(years);
    if (!Number.isFinite(p) || !Number.isFinite(annual) || !Number.isFinite(yrs) || p <= 0 || annual < 0 || yrs <= 0) { setError("Enter a monthly investment and years above zero, and an expected return of zero or more."); setResult(""); return; }
    const i = annual / 1200;
    const n = Math.round(yrs * 12);
    const fv = i === 0 ? p * n : p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = p * n;
    setError("");
    setResult(`Future value: ${fmt(fv)}\nTotal invested: ${fmt(invested)}\nEstimated gains: ${fmt(fv - invested)}\nFormula: FV = P × (((1+i)^n − 1) ÷ i) × (1+i), where P = ${fmt(p)} a month, i = ${annual}% ÷ 12, n = ${n} months.`);
  };
  return (
    <div>
      <p className="notice">Estimate only — not financial advice. Returns are not guaranteed; real investments go up and down, and taxes and fees are not included.</p>
      <label htmlFor="sip-monthly">Monthly investment</label>
      <input id="sip-monthly" className="input" type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
      <label htmlFor="sip-rate">Expected annual return (%)</label>
      <input id="sip-rate" className="input" type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
      <label htmlFor="sip-years">Years</label>
      <input id="sip-years" className="input" type="number" min="0" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate SIP Growth</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: 10,000 a month at an expected 12% a year for 10 years → about 2,323,390.76, of which 1,200,000 was invested and about 1,123,390.76 is estimated gain.</p>
    </div>
  );
}
