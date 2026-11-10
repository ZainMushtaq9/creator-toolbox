import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function DiscountCalculator() {
  const [mode, setMode] = useState("percent-off");
  const [price, setPrice] = useState("5000");
  const [percent, setPercent] = useState("20");
  const [after, setAfter] = useState("4000");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calc = () => {
    const p = Number(price);
    if (!Number.isFinite(p) || p < 0) { setError("Enter an original price of zero or more."); setResult(""); return; }
    if (mode === "percent-off") {
      const d = Number(percent);
      if (!Number.isFinite(d) || d < 0 || d > 100) { setError("Enter a discount between 0% and 100%."); setResult(""); return; }
      const saved = p * (d / 100);
      setError("");
      setResult(`You save: ${fmt(saved)}\nPrice after discount: ${fmt(p - saved)}\nFormula: discount = price × (discount % ÷ 100); final price = price − discount.`);
    } else {
      const a = Number(after);
      if (!Number.isFinite(a) || a < 0 || a > p || p === 0) { setError("Enter a sale price between zero and the original price."); setResult(""); return; }
      const d = ((p - a) / p) * 100;
      setError("");
      setResult(`Discount: ${fmt(d)}%\nYou save: ${fmt(p - a)}\nFormula: discount % = ((original price − sale price) ÷ original price) × 100.`);
    }
  };
  return (
    <div>
      <p className="notice">A plain price calculation — no taxes or extra fees are included.</p>
      <label htmlFor="disc-mode">What do you want to work out?</label>
      <select id="disc-mode" className="input" value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="percent-off">Price after a discount %</option>
        <option value="percent-from-prices">Discount % from before / after prices</option>
      </select>
      <label htmlFor="disc-price">Original price</label>
      <input id="disc-price" className="input" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
      {mode === "percent-off" ? (
        <div>
          <label htmlFor="disc-percent">Discount (%)</label>
          <input id="disc-percent" className="input" type="number" min="0" max="100" step="0.1" value={percent} onChange={(e) => setPercent(e.target.value)} />
        </div>
      ) : (
        <div>
          <label htmlFor="disc-after">Sale price (after discount)</label>
          <input id="disc-after" className="input" type="number" min="0" value={after} onChange={(e) => setAfter(e.target.value)} />
        </div>
      )}
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Discount</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: 5,000 with 20% off → you save 1,000 and pay 4,000. The other way: 5,000 down to 4,000 is a 20% discount.</p>
    </div>
  );
}
