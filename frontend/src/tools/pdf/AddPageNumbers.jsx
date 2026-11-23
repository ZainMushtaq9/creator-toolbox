import { useState } from "react";
import { formatBytes, validatePdfFile } from "./pdfSmall.js";
import { downloadBlob } from "../../utils/format.js";

export default function AddPageNumbers() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState("bottom-center");
  const [startAt, setStartAt] = useState(1);
  const [format, setFormat] = useState("n");
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
      setError("That file could not be read. It may be damaged or password-protected — encrypted PDFs cannot be numbered in the browser.");
      setFile(null);
    }
  };

  const apply = async () => {
    if (!file) { setError("Upload a PDF first."); return; }
    if (startAt < 0) { setError("The start number cannot be negative."); return; }
    setBusy(true); setError("");
    try {
      const { addPageNumbers, readFileBytes } = await import("./pdfUtils.js");
      const bytes = await addPageNumbers(await readFileBytes(file), { position, startAt, format });
      const blob = new Blob([bytes], { type: "application/pdf" });
      setOut({ blob, name: file.name.replace(/\.pdf$/i, "") + "-numbered.pdf", note: `Page numbers added to all ${pageCount} pages, starting at ${startAt}.` });
    } catch (err) {
      setError("Adding page numbers failed. The file may be damaged or password-protected. (" + (err?.message || "unknown error") + ")");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <p className="notice info">Add page numbers to every page of a PDF — “1”, “Page 1” or “1 of 12”, in the corner or margin you choose. Free, in your browser; nothing is uploaded.</p>
      <label htmlFor="pn-file">Upload a PDF (up to 20 MB)</label>
      <input id="pn-file" type="file" accept="application/pdf,.pdf" onChange={onFile} />
      {file && <p>{file.name} — {formatBytes(file.size)}{pageCount ? ` · ${pageCount} pages` : ""}</p>}
      <div className="toolbar">
        <label htmlFor="pn-position">Position</label>
        <select id="pn-position" value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="bottom-center">Bottom centre</option>
          <option value="bottom-right">Bottom right</option>
          <option value="bottom-left">Bottom left</option>
          <option value="top-center">Top centre</option>
          <option value="top-right">Top right</option>
          <option value="top-left">Top left</option>
        </select>
        <label htmlFor="pn-format">Format</label>
        <select id="pn-format" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="n">1, 2, 3…</option>
          <option value="page-n">Page 1, Page 2…</option>
          <option value="n-of-m">1 of 12, 2 of 12…</option>
        </select>
        <label htmlFor="pn-start">Start at</label>
        <input id="pn-start" type="number" min="0" max="9999" value={startAt} onChange={(e) => setStartAt(Number(e.target.value))} style={{ width: 80 }} />
      </div>
      <div className="toolbar"><button type="button" className="btn" disabled={busy || !file} onClick={apply}>{busy ? "Numbering…" : "Add Page Numbers"}</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {out && (
        <div className="output">
          <p className="success">{out.note}</p>
          <div className="toolbar"><button type="button" className="btn" onClick={() => downloadBlob(out.name, out.blob)}>Download Numbered PDF</button></div>
        </div>
      )}
    </div>
  );
}
