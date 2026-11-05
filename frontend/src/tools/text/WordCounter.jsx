import { useState, useMemo } from "react";
import { useCopy, Actions } from "../shared.jsx";
import { downloadText } from "../../utils/format.js";

export default function WordCounter() {
  const [text, setText] = useState("");
  const { msg, copy } = useCopy();
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const reading = words.length ? Math.max(1, Math.round(words.length / 200)) : 0;
    return { words: words.length, chars, charsNoSpaces, sentences, paragraphs, reading };
  }, [text]);
  return (
    <div>
      <p className="notice info">What is a word counter? A tool that counts words, characters, sentences and paragraphs — and estimates reading time. Your text never leaves your browser.</p>
      <label htmlFor="wc-text">Your text</label>
      <textarea id="wc-text" className="input" rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your text here…" />
      <div className="kv">
        <div className="stat"><b>{stats.words}</b>Words</div>
        <div className="stat"><b>{stats.chars}</b>Characters (with spaces)</div>
        <div className="stat"><b>{stats.charsNoSpaces}</b>Characters (no spaces)</div>
        <div className="stat"><b>{stats.sentences}</b>Sentences</div>
        <div className="stat"><b>{stats.paragraphs}</b>Paragraphs</div>
        <div className="stat"><b>{stats.reading ? `~${stats.reading} min` : "—"}</b>Reading time</div>
      </div>
      {msg && <p className="success">{msg}</p>}
      <Actions hasResult={!!text} onCopyAll={() => copy(text)} onDownload={() => downloadText("word-counter-text.txt", text)} onReset={() => setText("")} />
      <p>Reading time assumes about 200 words per minute. Numbers count as words; punctuation attached to a word does not create an extra word.</p>
    </div>
  );
}
