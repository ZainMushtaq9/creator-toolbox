import { useState } from "react";
import { formatBytes, validatePdfFile } from "./pdfSmall.js";
import { downloadBlob } from "../../utils/format.js";

export default function WatermarkPdf() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState("DRAFT");
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState(48);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState(null);

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validatePdfFile(f);
    if (err) { setError(err); return; }
    setError(""); setFile(f); setOut(null); setPageCount(0);
    try {
      const { getPdfPageCount, readFileBytes } = await import("./pdfUtils.js");
      setPageCount(await getPdfPageCount(await readFileBytes(f)));
    } catch {
      setError("That file could not be read. It may be damaged or password-protected — encrypted PDFs cannot be watermarked in the browser.");
      setFile(null);
    }
  };

  const apply = async () => {
    if (!file) { setError("Upload a PDF first."); return; }
    if (!text.trim()) { setError("Enter the watermark text."); return; }
    setBusy(true); setError("");
    try {
      const { watermarkPdf, readFileBytes } = await import("./pdfUtils.js");
      const bytes = await watermarkPdf(await readFileBytes(file), { text: text.trim(), opacity, fontSize });
      const blob = new Blob([bytes], { type: "application/pdf" });
      setOut({ blob, name: file.name.replace(/\.pdf$/i, "") + "-watermarked.pdf", note: `Watermark “${text.trim()}” added diagonally to all ${pageCount} pages.` });
    } catch (err) {
      setError("Watermarking failed. The file may be damaged or password-protected. (" + (err?.message || "unknown error") + ")");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <p className="notice info">Add a text watermark — “DRAFT”, “CONFIDENTIAL”, your name — diagonally across every page of a PDF. Free, in your browser; nothing is uploaded. The watermark is part of the PDF afterwards, not a separate layer you can toggle off.</p>
      <label htmlFor="wm-file">Upload a PDF (up to 20 MB)</label>
      <input id="wm-file" type="file" accept="application/pdf,.pdf" onChange={onFile} />
      {file && <p>{file.name} — {formatBytes(file.size)}{pageCount ? ` · ${pageCount} pages` : ""}</p>}
      <label htmlFor="wm-text">Watermark text</label>
      <input id="wm-text" type="text" value={text} maxLength={60} onChange={(e) => setText(e.target.value)} placeholder="DRAFT" />
      <label htmlFor="wm-opacity">Opacity: {Math.round(opacity * 100)}%</label>
      <input id="wm-opacity" type="range" min="0.1" max="0.6" step="0.05" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} style={{ width: "100%" }} />
      <label htmlFor="wm-size">Text size</label>
      <select id="wm-size" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}>
        <option value={32}>Small (32 pt)</option>
        <option value={48}>Medium (48 pt)</option>
        <option value={64}>Large (64 pt)</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" disabled={busy || !file} onClick={apply}>{busy ? "Applying…" : "Add Watermark"}</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {out && (
        <div className="output">
          <p className="success">{out.note}</p>
          <div className="toolbar"><button type="button" className="btn" onClick={() => downloadBlob(out.name, out.blob)}>Download Watermarked PDF</button></div>
        </div>
      )}
    </div>
  );
}
