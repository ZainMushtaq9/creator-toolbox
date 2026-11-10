import { useState } from "react";
import { useCopy } from "../shared.jsx";
const category = (bmi) => (bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy weight" : bmi < 30 ? "Overweight" : "Obese");
export default function BmiCalculator() {
  const [system, setSystem] = useState("metric");
  const [weight, setWeight] = useState("70");
  const [heightCm, setHeightCm] = useState("175");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const calc = () => {
    let bmi;
    if (system === "metric") {
      const w = Number(weight), h = Number(heightCm);
      if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) { setError("Enter positive numbers for weight and height."); setResult(""); return; }
      bmi = w / ((h / 100) * (h / 100));
      setError("");
      setResult(`Your BMI: ${bmi.toFixed(2)} — ${category(bmi)}\nFormula: weight (kg) ÷ height (m)² = ${w} ÷ ${(h / 100).toFixed(2)}²`);
      return;
    }
    const w = Number(weight), ft = Number(feet), inch = Number(inches);
    if (!Number.isFinite(w) || !Number.isFinite(ft) || !Number.isFinite(inch) || w <= 0 || ft < 0 || inch < 0 || (ft === 0 && inch === 0)) { setError("Enter a positive weight and a height above zero."); setResult(""); return; }
    const totalInches = ft * 12 + inch;
    bmi = (703 * w) / (totalInches * totalInches);
    setError("");
    setResult(`Your BMI: ${bmi.toFixed(2)} — ${category(bmi)}\nFormula: 703 × weight (lb) ÷ height (in)² = 703 × ${w} ÷ ${totalInches}²`);
  };
  return (
    <div>
      <p className="notice">Estimate only — not medical advice. BMI is a screening guide, not a diagnosis: it does not measure body fat, muscle or health on its own. Talk to a doctor for health decisions.</p>
      <label htmlFor="bmi-system">Units</label>
      <select id="bmi-system" className="input" value={system} onChange={(e) => setSystem(e.target.value)}>
        <option value="metric">Metric (kg, cm)</option>
        <option value="imperial">Imperial (lb, ft/in)</option>
      </select>
      <label htmlFor="bmi-weight">Weight ({system === "metric" ? "kg" : "lb"})</label>
      <input id="bmi-weight" className="input" type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
      {system === "metric" ? (
        <div>
          <label htmlFor="bmi-cm">Height (cm)</label>
          <input id="bmi-cm" className="input" type="number" min="0" step="0.1" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
        </div>
      ) : (
        <div>
          <label htmlFor="bmi-ft">Height (feet)</label>
          <input id="bmi-ft" className="input" type="number" min="0" value={feet} onChange={(e) => setFeet(e.target.value)} />
          <label htmlFor="bmi-in">Height (inches)</label>
          <input id="bmi-in" className="input" type="number" min="0" value={inches} onChange={(e) => setInches(e.target.value)} />
        </div>
      )}
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate BMI</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>WHO categories: under 18.5 Underweight · 18.5–24.9 Healthy weight · 25–29.9 Overweight · 30 and above Obese. Example: 70 kg at 175 cm → BMI 22.86, Healthy weight.</p>
    </div>
  );
}
