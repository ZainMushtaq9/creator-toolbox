import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("70");
  const [unit, setUnit] = useState("kg");
  const [activity, setActivity] = useState("35");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const calc = () => {
    const w = Number(weight), ml = Number(activity);
    if (!Number.isFinite(w) || w <= 0) { setError("Enter a weight above zero."); setResult(""); return; }
    const kg = unit === "kg" ? w : w * 0.45359237;
    const litres = (kg * ml) / 1000;
    const glasses = Math.round(litres * 1000 / 250);
    setError("");
    setResult(`Recommended water intake: about ${litres.toFixed(2)} litres per day (about ${glasses} glasses of 250 ml).\nFormula: weight in kg × ${ml} ml per kg. Your weight is ${kg.toFixed(1)} kg.`);
  };
  return (
    <div>
      <p className="notice">Estimate only — not medical advice. Needs vary with heat, exercise, illness and pregnancy. Drink to thirst as well, and ask a doctor if you have a condition that limits fluids.</p>
      <label htmlFor="water-weight">Your weight</label>
      <input id="water-weight" className="input" type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
      <label htmlFor="water-unit">Weight unit</label>
      <select id="water-unit" className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
        <option value="kg">Kilograms (kg)</option>
        <option value="lb">Pounds (lb)</option>
      </select>
      <label htmlFor="water-activity">Activity level</label>
      <select id="water-activity" className="input" value={activity} onChange={(e) => setActivity(e.target.value)}>
        <option value="30">Low activity — about 30 ml per kg</option>
        <option value="35">Moderate activity — about 35 ml per kg</option>
        <option value="40">High activity / hot weather — about 40 ml per kg</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Water Intake</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: 70 kg at moderate activity → 70 × 35 ml = 2.45 litres a day, about 10 glasses.</p>
    </div>
  );
}
