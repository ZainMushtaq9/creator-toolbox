import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function InstagramEngagementCalculator() {
  const [likes, setLikes] = useState("1200");
  const [comments, setComments] = useState("80");
  const [saves, setSaves] = useState("150");
  const [followers, setFollowers] = useState("20000");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const calc = () => {
    const l = Number(likes), c = Number(comments), s = Number(saves), f = Number(followers);
    if ([l, c, s, f].some((n) => !Number.isFinite(n) || n < 0)) { setError("Enter zero or positive numbers."); setResult(""); return; }
    if (f === 0) { setError("Follower count must be greater than zero."); setResult(""); return; }
    const rate = ((l + c + s) / f) * 100;
    const verdict = rate >= 3 ? "Strong — above the typical 1–3% range." : rate >= 1 ? "Typical — in the usual 1–3% range." : "Below typical — consider posting time, format variety and audience fit.";
    setError("");
    setResult(`Engagement rate: ${rate.toFixed(2)}%\nFormula: ((likes + comments + saves) ÷ followers) × 100 = ((${l} + ${c} + ${s}) ÷ ${f}) × 100\n${verdict}`);
  };
  return (
    <div>
      <p className="notice info">Formula: engagement rate = ((likes + comments + saves) ÷ followers) × 100. Calculated locally; no data is stored.</p>
      <label htmlFor="ie-likes">Likes (per post, or average)</label>
      <input id="ie-likes" className="input" type="number" min="0" value={likes} onChange={(e) => setLikes(e.target.value)} />
      <label htmlFor="ie-comments">Comments</label>
      <input id="ie-comments" className="input" type="number" min="0" value={comments} onChange={(e) => setComments(e.target.value)} />
      <label htmlFor="ie-saves">Saves</label>
      <input id="ie-saves" className="input" type="number" min="0" value={saves} onChange={(e) => setSaves(e.target.value)} />
      <label htmlFor="ie-followers">Followers</label>
      <input id="ie-followers" className="input" type="number" min="0" value={followers} onChange={(e) => setFollowers(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Engagement</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
    </div>
  );
}
