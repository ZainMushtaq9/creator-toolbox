import { useState } from "react";
import { copyText } from "../utils/format.js";

export function useCopy() {
  const [msg, setMsg] = useState("");
  const copy = (text) => copyText(text, setMsg);
  return { msg, setMsg, copy };
}

// Minimal replacement for the zod checks this app used: trim + minimum
// length (with the field's own message) and an optional maximum length
// (zod's default message, reproduced verbatim). Returns "" when valid.
// zod itself is no longer a frontend dependency (patch 043) — the backend
// still uses it, so only frontend/package.json drops it.
export function checkLength(value, min, message, max) {
  const v = (value ?? "").trim();
  if (v.length < min) return message;
  if (max !== undefined && v.length > max) return `String must contain at most ${max} character(s).`;
  return "";
}

export function TemplateNote() {
  return <p className="notice info">Template-based generator — not AI. Your input stays in your browser; nothing is uploaded.</p>;
}

export function ResultList({ items, onCopy }) {
  if (!items || !items.length) return null;
  return (
    <ul className="result-list">
      {items.map((it, i) => (
        <li key={i}><span>{it}</span><button type="button" className="btn btn-sm secondary" onClick={() => onCopy(it)}>Copy</button></li>
      ))}
    </ul>
  );
}

export function Actions({ onReset, onCopyAll, onDownload, hasResult }) {
  return (
    <div className="toolbar">
      {onCopyAll && <button type="button" className="btn secondary" disabled={!hasResult} onClick={onCopyAll}>Copy all</button>}
      {onDownload && <button type="button" className="btn secondary" disabled={!hasResult} onClick={onDownload}>Download</button>}
      <button type="button" className="btn ghost" onClick={onReset}>Reset</button>
    </div>
  );
}

export function topicTemplates(topic) {
  const t = topic.trim();
  return {
    howto: [
      `How to ${t} (Step-by-Step Guide)`,
      `${t}: The Beginner's Guide That Actually Works`,
      `How I Learned ${t} — And What I'd Do Differently`,
      `Learn ${t} in 7 Days: A Simple Plan`
    ],
    list: [
      `7 ${t} Mistakes You Should Avoid`,
      `10 Best ${t} Tips for Beginners`,
      `5 ${t} Secrets Nobody Tells You`,
      `Top 8 ${t} Ideas You Need to Try`
    ],
    curiosity: [
      `I Tried ${t} for 30 Days — Here's What Happened`,
      `The Truth About ${t} (Nobody Talks About This)`,
      `${t}: What I Wish I Knew Before Starting`,
      `Why Everyone Is Talking About ${t}`
    ],
    question: [
      `Is ${t} Worth It in 2026?`,
      `Can You Really Learn ${t} From Scratch?`,
      `What Is ${t} — Explained Simply`,
      `Should You Start ${t}? Honest Answer`
    ]
  };
}

export function hashtagBase(topic) {
  const words = topic.trim().toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const joined = words.map((x) => x[0].toUpperCase() + x.slice(1)).join("");
  const spaced = words.join("");
  const out = new Set();
  if (joined) out.add(`#${joined}`);
  if (spaced && spaced !== joined.toLowerCase()) out.add(`#${spaced}`);
  words.forEach((x) => { if (x.length > 2) out.add(`#${x[0].toUpperCase() + x.slice(1)}`); });
  return [...out];
}
