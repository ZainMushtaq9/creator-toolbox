import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function CalorieCalculator() {
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState("30");
  const [weight, setWeight] = useState("80");
  const [height, setHeight] = useState("180");
  const [activity, setActivity] = useState("1.55");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const calc = () => {
    const a = Number(age), w = Number(weight), h = Number(height), act = Number(activity);
    if (!Number.isFinite(a) || !Number.isFinite(w) || !Number.isFinite(h) || a <= 0 || a > 120 || w <= 0 || h <= 0) { setError("Enter an age between 1 and 120, and a weight and height above zero."); setResult(""); return; }
    const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * act;
    setError("");
    setResult(`BMR (calories burned at rest): about ${fmt(bmr)} kcal/day\nMaintenance calories (TDEE): about ${fmt(tdee)} kcal/day\nFormula (Mifflin-St Jeor): men 10 × weight + 6.25 × height − 5 × age + 5; women the same with − 161 instead of + 5. TDEE = BMR × activity factor (${act}).`);
  };
  return (
    <div>
      <p className="notice">Estimate only — not medical advice. Real calorie needs vary with body composition, health and daily routine. Talk to a doctor or dietitian before changing your diet.</p>
      <label htmlFor="cal-sex">Sex</label>
      <select id="cal-sex" className="input" value={sex} onChange={(e) => setSex(e.target.value)}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <label htmlFor="cal-age">Age (years)</label>
      <input id="cal-age" className="input" type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} />
      <label htmlFor="cal-weight">Weight (kg)</label>
      <input id="cal-weight" className="input" type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
      <label htmlFor="cal-height">Height (cm)</label>
      <input id="cal-height" className="input" type="number" min="0" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} />
      <label htmlFor="cal-activity">Activity level</label>
      <select id="cal-activity" className="input" value={activity} onChange={(e) => setActivity(e.target.value)}>
        <option value="1.2">Sedentary — little or no exercise</option>
        <option value="1.375">Lightly active — light exercise 1–3 days a week</option>
        <option value="1.55">Moderately active — moderate exercise 3–5 days a week</option>
        <option value="1.725">Very active — hard exercise 6–7 days a week</option>
        <option value="1.9">Extra active — physical job or training twice a day</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Calories</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: a 30-year-old man, 80 kg, 180 cm, moderately active → BMR about 1,780 kcal/day and maintenance about 2,759 kcal/day.</p>
    </div>
  );
}
