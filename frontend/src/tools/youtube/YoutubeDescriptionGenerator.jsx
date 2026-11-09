import { useState } from "react";
import { useCopy, TemplateNote, Actions, checkLength } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

export default function YoutubeDescriptionGenerator() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [points, setPoints] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const generate = () => {
    const err = checkLength(title, 2, "Enter a video title.") || checkLength(topic, 2, "Enter the video topic.") || checkLength(points, 2, "Add at least one key point your video covers.");
    if (err) { setError(err); return; }
    setError("");
    const list = points.split("\n").map((p) => p.trim()).filter(Boolean);
    setResult(`${title}\n\nIn this video, I break down ${topic} — what works, what to avoid, and how to get started.\n\nWhat you'll learn:\n${list.map((p) => `- ${p}`).join("\n")}\n\nTimestamps:\n00:00 Introduction\n01:00 ${list[0] || topic}\n\nLinks and resources:\n[Add your links here]\n\nIf this helped, subscribe for more videos about ${topic}.`);
  };
  return (
    <div>
      <TemplateNote />
      <label htmlFor="yd-title">Video title</label>
      <input id="yd-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. How to Start Budget Travel" />
      <label htmlFor="yd-topic">Topic</label>
      <input id="yd-topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. budget travel" />
      <label htmlFor="yd-points">Key points (one per line)</label>
      <textarea id="yd-points" className="input" rows={4} value={points} onChange={(e) => setPoints(e.target.value)} placeholder={"Mistake 1\nMistake 2"} />
      <div className="toolbar"><button type="button" className="btn" onClick={generate}>Generate Description</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success" role="status">{msg}</p>}
      {result && <div className="output">{result}</div>}
      <Actions hasResult={!!result} onCopyAll={() => copy(result)} onDownload={() => downloadText("youtube-description.txt", result)} onReset={() => { setTitle(""); setTopic(""); setPoints(""); setResult(""); setError(""); }} />
    </div>
  );
}
