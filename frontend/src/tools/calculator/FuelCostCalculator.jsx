import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function FuelCostCalculator() {
  const [distance, setDistance] = useState("300");
  const [mileage, setMileage] = useState("15");
  const [price, setPrice] = useState("250");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calc = () => {
    const dist = Number(distance), mil = Number(mileage), p = Number(price);
    if (!Number.isFinite(dist) || !Number.isFinite(mil) || !Number.isFinite(p) || dist <= 0 || mil <= 0 || p < 0) { setError("Enter a distance and mileage above zero, and a fuel price of zero or more."); setResult(""); return; }
    const litres = dist / mil;
    const cost = litres * p;
    setError("");
    setResult(`Fuel needed: ${fmt(litres)} litres\nTotal fuel cost: Rs ${fmt(cost)}\nCost per kilometre: Rs ${fmt(cost / dist)}\nFormula: fuel = distance ÷ mileage; cost = fuel × price per litre.`);
  };
  return (
    <div>
      <p className="notice">Estimate only. Enter today's fuel price per litre yourself — no live fuel price is built in, and prices change. Your real mileage varies with traffic, load and driving style.</p>
      <label htmlFor="fuel-distance">Distance (km)</label>
      <input id="fuel-distance" className="input" type="number" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} />
      <label htmlFor="fuel-mileage">Vehicle mileage (km per litre)</label>
      <input id="fuel-mileage" className="input" type="number" min="0" step="0.1" value={mileage} onChange={(e) => setMileage(e.target.value)} />
      <label htmlFor="fuel-price">Today's fuel price per litre (Rs) — enter it yourself</label>
      <input id="fuel-price" className="input" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Fuel Cost</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: 300 km at 15 km per litre → 20 litres. At Rs 250 a litre that costs Rs 5,000, or Rs 16.67 per kilometre.</p>
    </div>
  );
}
