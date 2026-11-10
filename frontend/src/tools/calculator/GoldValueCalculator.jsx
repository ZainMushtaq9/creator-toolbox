import { useState } from "react";
import { useCopy } from "../shared.jsx";
const GRAMS_PER_TOLA = 11.664;
const UNIT_IN_TOLA = { tola: 1, gram: 1 / GRAMS_PER_TOLA, masha: 1 / 12, ratti: 1 / 96 };
export default function GoldValueCalculator() {
  const [weight, setWeight] = useState("2");
  const [unit, setUnit] = useState("tola");
  const [karat, setKarat] = useState("22");
  const [rate, setRate] = useState("400000");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calc = () => {
    const w = Number(weight), k = Number(karat), r = Number(rate);
    if (!Number.isFinite(w) || !Number.isFinite(r) || w <= 0 || r <= 0) { setError("Enter a weight and a per-tola rate above zero."); setResult(""); return; }
    const tola = w * UNIT_IN_TOLA[unit];
    const value = tola * r * (k / 24);
    setError("");
    setResult(`Weight: ${fmt(tola)} tola (${fmt(tola * GRAMS_PER_TOLA)} grams)\nValue at ${k}K: Rs ${fmt(value)}\nFormula: value = weight in tola × per-tola 24K rate × (karat ÷ 24). 1 tola = 11.664 grams, 1 tola = 12 masha = 96 ratti.`);
  };
  return (
    <div>
      <p className="notice">Estimate only. Enter today's per-tola 24K rate from your local sarafa market yourself — no live gold price is built in, and rates change daily. Making charges are not included.</p>
      <label htmlFor="gold-weight">Weight</label>
      <input id="gold-weight" className="input" type="number" min="0" step="0.01" value={weight} onChange={(e) => setWeight(e.target.value)} />
      <label htmlFor="gold-unit">Weight unit</label>
      <select id="gold-unit" className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
        <option value="tola">Tola</option>
        <option value="gram">Gram</option>
        <option value="masha">Masha</option>
        <option value="ratti">Ratti</option>
      </select>
      <label htmlFor="gold-karat">Purity (karat)</label>
      <select id="gold-karat" className="input" value={karat} onChange={(e) => setKarat(e.target.value)}>
        <option value="24">24K (pure)</option>
        <option value="22">22K</option>
        <option value="21">21K</option>
        <option value="18">18K</option>
      </select>
      <label htmlFor="gold-rate">Today's 24K rate per tola (Rs) — enter it yourself</label>
      <input id="gold-rate" className="input" type="number" min="0" value={rate} onChange={(e) => setRate(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Gold Value</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: 2 tola of 22K gold at a 24K rate of Rs 400,000 per tola → 2 × 400,000 × (22 ÷ 24) = Rs 733,333.33.</p>
    </div>
  );
}
