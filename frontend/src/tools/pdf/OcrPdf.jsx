import { useState } from "react";
import { Link } from "react-router-dom";
import { MAX_OCR_PAGES, formatBytes } from "./pdfSmall.js";
import { downloadText, copyText } from "../../utils/format.js";

// OCR: reads text from scanned PDFs and images with Tesseract.js, in the
// browser. The OCR engine (code + English language data) downloads from a
// public CDN the first time it is used; the user's file itself is never
// uploaded. English only — the page says so.
export default function OcrPdf() {
  const [file, setFile] = useState(null);
  const [kind, setKind] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [empty, setEmpty] = useState(false);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name || "");
    const isImage = /^image\/(jpeg|png)$/.test(f.type) || /\.(jpe?g|png)$/i.test(f.name || "");
    if (!isPdf && !isImage) { setError("Please choose a PDF, JPG or PNG file."); return; }
    if (f.size > 20 * 1024 * 1024) { setError("File is over the 20 MB limit."); return; }
    setError(""); setFile(f); setKind(isPdf ? "pdf" : "image"); setText(""); setEmpty(false); setMsg("");
  };

  const runOcr = async () => {
    if (!file) { setError("Upload a scanned PDF or an image first."); return; }
    setBusy(true); setError(""); setText(""); setEmpty(false);
    let worker = null;
    try {
      setProgress("Loading the OCR engine (first use downloads it from a CDN)…");
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text" && typeof m.progress === "number") {
            setProgress(`Reading text… ${Math.round(m.progress * 100)}%`);
          }
        },
      });
      let joined = "";
      if (kind === "image") {
        setProgress("Reading text…");
        const { data } = await worker.recognize(file);
        joined = (data.text || "").trim();
      } else {
        const { renderPdfPageToCanvas, getPdfPageCountJs } = await import("./pdfRender.js");
        const { readFileBytes } = await import("./pdfUtils.js");
        const bytes = await readFileBytes(file);
        const total = await getPdfPageCountJs(bytes);
        const pages = Math.min(total, MAX_OCR_PAGES);
        const parts = [];
        for (let i = 1; i <= pages; i++) {
          setProgress(`Rendering page ${i} of ${pages}…`);
          const canvas = await renderPdfPageToCanvas(bytes, i, 2);
          setProgress(`Reading page ${i} of ${pages}…`);
          const { data } = await worker.recognize(canvas);
          parts.push((data.text || "").trim());
        }
        if (total > MAX_OCR_PAGES) {
          parts.push(`\n[Only the first ${MAX_OCR_PAGES} pages were read — this PDF has ${total} pages.]`);
        }
        joined = parts.join("\n\n").trim();
      }
      setProgress("");
      if (!joined) { setEmpty(true); setText(""); }
      else setText(joined);
    } catch (err) {
      setError("OCR failed. Check your connection (the engine downloads on first use) and try a clearer file. (" + (err?.message || "unknown error") + ")");
      setProgress("");
    } finally {
      try { await worker?.terminate(); } catch { /* already stopped */ }
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="notice info">Read text from a scanned PDF or a photo of a document — free, in your browser. Your file is never uploaded; OCR runs locally with Tesseract. English only, and best on clear, straight scans. The OCR engine downloads from a public CDN on first use (about 10 MB).</p>
      <label htmlFor="oc-file">Upload a scanned PDF, JPG or PNG (up to 20 MB)</label>
      <input id="oc-file" type="file" accept="application/pdf,.pdf,image/jpeg,image/png" onChange={onFile} />
      {file && <p>{file.name} — {formatBytes(file.size)}{kind === "pdf" ? ` · first ${MAX_OCR_PAGES} pages are read` : ""}</p>}
      <div className="toolbar"><button type="button" className="btn" disabled={busy || !file} onClick={runOcr}>{busy ? "Reading…" : "Read Text (OCR)"}</button></div>
      {progress && <p role="status">{progress}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {empty && (
        <div className="output">
          <p className="notice info">No text was recognised. The scan may be blurry, skewed or handwritten — OCR works best on clear, straight, printed text. If your PDF already has a text layer, the <Link to="/tools/pdf-to-text">PDF to Text tool</Link> extracts it exactly instead.</p>
        </div>
      )}
      {text && (
        <div className="output">
          <p className="success">Recognised {text.length.toLocaleString()} characters. Check the text — OCR can misread similar letters (0/O, 1/l), so proofread anything important.</p>
          <label htmlFor="oc-out">Recognised text</label>
          <textarea id="oc-out" readOnly value={text} rows={12} style={{ width: "100%" }} />
          <div className="toolbar">
            <button type="button" className="btn secondary" onClick={() => copyText(text, setMsg)}>Copy Text</button>
            <button type="button" className="btn secondary" onClick={() => downloadText((file?.name || "document").replace(/\.[^.]+$/, "") + "-ocr.txt", text)}>Download .txt</button>
          </div>
          {msg && <p className="success" role="status">{msg}</p>}
        </div>
      )}
    </div>
  );
}
