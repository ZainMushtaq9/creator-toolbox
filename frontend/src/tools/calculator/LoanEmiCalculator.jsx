import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function LoanEmiCalculator() {
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("5");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calc = () => {
    const p = Number(amount), annual = Number(rate), yrs = Number(years);
    if (!Number.isFinite(p) || !Number.isFinite(annual) || !Number.isFinite(yrs) || p <= 0 || annual < 0 || yrs <= 0) { setError("Enter a loan amount and tenure above zero, and an interest rate of zero or more."); setResult(""); return; }
    const n = Math.round(yrs * 12);
    const r = annual / 1200;
    const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    setError("");
    setResult(`Monthly EMI: ${fmt(emi)}\nTotal interest: ${fmt(total - p)}\nTotal payment: ${fmt(total)}\nFormula: EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P = ${fmt(p)}, r = ${annual}% ÷ 12 = ${r.toFixed(6)}, n = ${n} months.`);
  };
  return (
    <div>
      <p className="notice">Estimate only — not financial advice. Real loan payments depend on the lender's exact rate, fees and schedule, which this calculator does not include.</p>
      <label htmlFor="emi-amount">Loan amount</label>
      <input id="emi-amount" className="input" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <label htmlFor="emi-rate">Annual interest rate (%)</label>
      <input id="emi-rate" className="input" type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
      <label htmlFor="emi-years">Tenure (years)</label>
      <input id="emi-years" className="input" type="number" min="0" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate EMI</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: 100,000 at 10% annual interest for 5 years → monthly EMI about 2,124.70, total interest about 27,482.27.</p>
    </div>
  );
}
