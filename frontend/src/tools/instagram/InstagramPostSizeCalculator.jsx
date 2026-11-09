import { useState } from "react";
import { useCopy } from "../shared.jsx";
const SIZES = {
  square: { label: "Feed — Square (1:1)", size: "1080 × 1080", note: "The classic feed post. Safe and always fully visible." },
  portrait: { label: "Feed — Portrait (4:5)", size: "1080 × 1350", note: "Uses the most screen space in the feed. Tallest a feed photo can be." },
  landscape: { label: "Feed — Landscape (1.91:1)", size: "1080 × 566", note: "Wide photos. Shows smaller in the feed than portrait." },
  story: { label: "Story / Reel (9:16)", size: "1080 × 1920", note: "Full-screen vertical. Keep text away from top and bottom edges." },
  profile: { label: "Profile picture (1:1)", size: "320 × 320", note: "Displayed as a circle — keep faces and logos centred." }
};
export default function InstagramPostSizeCalculator() {
  const [format, setFormat] = useState("square");
  const s = SIZES[format];
  const { msg, copy } = useCopy();
  return (
    <div>
      <label htmlFor="ips-format">Format</label>
      <select id="ips-format" className="input" value={format} onChange={(e) => setFormat(e.target.value)}>
        {Object.entries(SIZES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
      </select>
      <div className="output"><strong>{s.label}</strong><br />Recommended size: {s.size} px<br />{s.note}</div>
      <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(`${s.label}\nRecommended size: ${s.size} px\n${s.note}`)}>Copy result</button></div>
      {msg && <p className="success" role="status">{msg}</p>}
      <h3>All recommended sizes</h3>
      <table className="table"><thead><tr><th>Format</th><th>Size (px)</th><th>Ratio</th></tr></thead>
        <tbody>{Object.values(SIZES).map((v) => <tr key={v.label}><td>{v.label}</td><td>{v.size}</td><td>{v.label.match(/\(([^)]+)\)/)?.[1] || "—"}</td></tr>)}</tbody>
      </table>
      <p>Instagram compresses uploads, so starting from the recommended size gives the best result. Use the <a href="/tools/image-resizer">Image Resizer</a> to match these sizes before uploading.</p>
    </div>
  );
}
