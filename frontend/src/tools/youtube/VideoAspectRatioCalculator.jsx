import { useState } from "react";
import { useCopy } from "../shared.jsx";
import { gcd } from "../../utils/format.js";

const PRESETS = { "16:9": [16, 9], "9:16": [9, 16], "1:1": [1, 1], "4:5": [4, 5], "4:3": [4, 3], "21:9": [21, 9] };
export default function VideoAspectRatioCalculator() {
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [preset, setPreset] = useState("16:9");
  const [known, setKnown] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const calc = () => {
    const w = Number(width), h = Number(height);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) { setError("Enter positive numbers for width and height."); setResult(""); return; }
    const g = gcd(Math.round(w), Math.round(h));
    let line = `Aspect ratio: ${Math.round(w) / g}:${Math.round(h) / g} (${w} × ${h})`;
    const [pr, qr] = PRESETS[preset];
    const kv = Number(known);
    if (Number.isFinite(kv) && kv > 0) line += `\nAt ${preset}: width ${kv} → height ${Math.round((kv * qr) / pr)} · height ${kv} → width ${Math.round((kv * pr) / qr)}`;
    setError(""); setResult(line);
  };
  return (
    <div>
      <p className="notice info">Formula: aspect ratio = width ÷ GCD : height ÷ GCD. Matching side = known side × (other ratio part ÷ known ratio part).</p>
      <label htmlFor="ar-w">Width (px)</label>
      <input id="ar-w" className="input" type="number" min="1" value={width} onChange={(e) => setWidth(e.target.value)} />
      <label htmlFor="ar-h">Height (px)</label>
      <input id="ar-h" className="input" type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} />
      <label htmlFor="ar-preset">Target ratio</label>
      <select id="ar-preset" className="input" value={preset} onChange={(e) => setPreset(e.target.value)}>
        {Object.keys(PRESETS).map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <label htmlFor="ar-known">Known side (optional, px) — to find the matching side at the target ratio</label>
      <input id="ar-known" className="input" type="number" min="1" value={known} onChange={(e) => setKnown(e.target.value)} placeholder="e.g. 1080" />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Ratio</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Common sizes: YouTube 1920 × 1080 (16:9) · Shorts/Reels/TikTok 1080 × 1920 (9:16) · Square post 1080 × 1080 (1:1) · Portrait post 1080 × 1350 (4:5).</p>
    </div>
  );
}
