import { useState } from "react";
import { useCopy } from "../shared.jsx";
const UNITS = {
  length: [
    { value: "mm", label: "Millimetres (mm)", toBase: 0.001 },
    { value: "cm", label: "Centimetres (cm)", toBase: 0.01 },
    { value: "m", label: "Metres (m)", toBase: 1 },
    { value: "km", label: "Kilometres (km)", toBase: 1000 },
    { value: "in", label: "Inches (in)", toBase: 0.0254 },
    { value: "ft", label: "Feet (ft)", toBase: 0.3048 },
    { value: "yd", label: "Yards (yd)", toBase: 0.9144 },
    { value: "mi", label: "Miles (mi)", toBase: 1609.344 }
  ],
  weight: [
    { value: "g", label: "Grams (g)", toBase: 0.001 },
    { value: "kg", label: "Kilograms (kg)", toBase: 1 },
    { value: "lb", label: "Pounds (lb)", toBase: 0.45359237 },
    { value: "oz", label: "Ounces (oz)", toBase: 0.028349523125 }
  ],
  temperature: [
    { value: "c", label: "Celsius (°C)" },
    { value: "f", label: "Fahrenheit (°F)" },
    { value: "k", label: "Kelvin (K)" }
  ]
};
const fmt = (n) => Number(n.toFixed(4)).toLocaleString(undefined, { maximumFractionDigits: 4 });
export default function UnitConverter() {
  const [kind, setKind] = useState("length");
  const [from, setFrom] = useState("km");
  const [to, setTo] = useState("mi");
  const [value, setValue] = useState("5");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const changeKind = (k) => {
    setKind(k);
    const units = UNITS[k];
    setFrom(units[0].value);
    setTo(units[1].value);
    setResult("");
    setError("");
  };
  const convertTemp = (v, f, t) => {
    const toC = f === "c" ? v : f === "f" ? (v - 32) * 5 / 9 : v - 273.15;
    return t === "c" ? toC : t === "f" ? toC * 9 / 5 + 32 : toC + 273.15;
  };
  const calc = () => {
    const v = Number(value);
    if (!Number.isFinite(v)) { setError("Enter a number to convert."); setResult(""); return; }
    const fromUnit = UNITS[kind].find((u) => u.value === from);
    const toUnit = UNITS[kind].find((u) => u.value === to);
    let out, formula;
    if (kind === "temperature") {
      out = convertTemp(v, from, to);
      formula = "Celsius = (Fahrenheit − 32) × 5/9; Fahrenheit = Celsius × 9/5 + 32; Kelvin = Celsius + 273.15.";
    } else {
      out = (v * fromUnit.toBase) / toUnit.toBase;
      formula = `Fixed factors: 1 km = 1000 m, 1 mile = 1609.344 m, 1 kg = 2.20462 lb, 1 oz = 28.3495 g. Converted via the base unit (${kind === "length" ? "metres" : "kilograms"}).`;
    }
    setError("");
    setResult(`${fmt(v)} ${fromUnit.label} = ${fmt(out)} ${toUnit.label}\n${formula}`);
  };
  return (
    <div>
      <p className="notice info">Length, weight and temperature with fixed conversion factors. No currency — exchange rates change daily, so no currency conversion is offered here. Calculated locally; nothing is uploaded.</p>
      <label htmlFor="uc-kind">What to convert</label>
      <select id="uc-kind" className="input" value={kind} onChange={(e) => changeKind(e.target.value)}>
        <option value="length">Length</option>
        <option value="weight">Weight</option>
        <option value="temperature">Temperature</option>
      </select>
      <label htmlFor="uc-value">Value</label>
      <input id="uc-value" className="input" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
      <label htmlFor="uc-from">From</label>
      <select id="uc-from" className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
        {UNITS[kind].map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
      </select>
      <label htmlFor="uc-to">To</label>
      <select id="uc-to" className="input" value={to} onChange={(e) => setTo(e.target.value)}>
        {UNITS[kind].map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Convert</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Examples: 5 km = 3.1069 miles · 2.5 kg = 5.5116 lb · 100 °C = 212 °F.</p>
    </div>
  );
}
