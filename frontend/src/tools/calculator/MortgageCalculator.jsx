import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function MortgageCalculator() {
  const [price, setPrice] = useState("10000000");
  const [down, setDown] = useState("2000000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("20");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calc = () => {
    const hp = Number(price), dp = Number(down), annual = Number(rate), yrs = Number(years);
    if (!Number.isFinite(hp) || !Number.isFinite(dp) || !Number.isFinite(annual) || !Number.isFinite(yrs) || hp <= 0 || dp < 0 || dp >= hp || annual < 0 || yrs <= 0) { setError("Enter a home price above zero, a down payment smaller than the price, and a rate and tenure above zero."); setResult(""); return; }
    const p = hp - dp;
    const n = Math.round(yrs * 12);
    const r = annual / 1200;
    const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    setError("");
    setResult(`Loan amount (price − down payment): ${fmt(p)}\nMonthly payment: ${fmt(emi)}\nTotal interest: ${fmt(total - p)}\nTotal payment: ${fmt(total)}\nFormula: payment = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P = ${fmt(p)}, r = ${annual}% ÷ 12, n = ${n} months.`);
  };
  return (
    <div>
      <p className="notice">Estimate only — not financial advice. Real mortgage payments depend on the lender's exact rate, fees, taxes and insurance, which this calculator does not include.</p>
      <label htmlFor="mort-price">Home price</label>
      <input id="mort-price" className="input" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
      <label htmlFor="mort-down">Down payment</label>
      <input id="mort-down" className="input" type="number" min="0" value={down} onChange={(e) => setDown(e.target.value)} />
      <label htmlFor="mort-rate">Annual interest rate (%)</label>
      <input id="mort-rate" className="input" type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
      <label htmlFor="mort-years">Loan tenure (years)</label>
      <input id="mort-years" className="input" type="number" min="0" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Mortgage</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: a 10,000,000 home with a 2,000,000 down payment, 12% annual interest over 20 years → loan 8,000,000, monthly payment about 88,086.89, total interest about 13,140,853.76.</p>
    </div>
  );
}
