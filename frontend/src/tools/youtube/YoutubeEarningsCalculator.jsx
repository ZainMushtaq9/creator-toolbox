import { useState } from "react";
export default function YoutubeEarningsCalculator() {
  const [views, setViews] = useState("100000");
  const [rpm, setRpm] = useState("3");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const calc = () => {
    const v = Number(views), r = Number(rpm);
    if (!Number.isFinite(v) || !Number.isFinite(r) || v < 0 || r < 0) { setError("Enter zero or positive numbers for views and RPM."); setResult(""); return; }
    const monthly = (v / 1000) * r;
    setError("");
    setResult(`Estimated monthly earnings: $${monthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}\nEstimated yearly earnings (same monthly views): $${(monthly * 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}\nFormula: (views ÷ 1,000) × RPM.`);
  };
  return (
    <div>
      <p className="notice">Estimate only — not a guarantee. Real RPM varies by country, niche, advertiser demand and season, and YouTube takes a share of ad revenue.</p>
      <label htmlFor="ye-views">Monthly views</label>
      <input id="ye-views" className="input" type="number" min="0" value={views} onChange={(e) => setViews(e.target.value)} />
      <label htmlFor="ye-rpm">RPM — revenue per 1,000 views (USD). Try $1, $3 and $8 to see the range.</label>
      <input id="ye-rpm" className="input" type="number" min="0" step="0.1" value={rpm} onChange={(e) => setRpm(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Earnings</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      <p>Typical RPM is roughly $1–$10 for most channels. Finance and business audiences often earn more per view than entertainment audiences.</p>
    </div>
  );
}
