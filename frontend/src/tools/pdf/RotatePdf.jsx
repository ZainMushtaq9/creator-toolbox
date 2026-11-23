import { useState } from "react";
import { formatBytes, validatePdfFile } from "./pdfSmall.js";
import { downloadBlob } from "../../utils/format.js";

export default function RotatePdf() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotation, setRotation] = useState(90);
  const [scope, setScope] = useState("all");
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
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
      const n = await getPdfPageCount(await readFileBytes(f));
      setPageCount(n); setTo(n);
    } catch {
      setError("That file could not be read. It may be damaged or password-protected — encrypted PDFs cannot be rotated in the browser.");
      setFile(null);
    }
  };

  const rotate = async () => {
    if (!file || !pageCount) { setError("Upload a PDF first."); return; }
    if (scope === "range" && (from < 1 || to > pageCount || from > to)) { setError(`Pages must be between 1 and ${pageCount}.`); return; }
    setBusy(true); setError("");
    try {
      const { rotatePdf, readFileBytes } = await import("./pdfUtils.js");
      const bytes = await rotatePdf(await readFileBytes(file), rotation, scope === "range" ? from : 1, scope === "range" ? to : null);
      const blob = new Blob([bytes], { type: "application/pdf" });
      setOut({ blob, name: file.name.replace(/\.pdf$/i, "") + "-rotated.pdf", note: scope === "range" ? `Rotated pages ${from}–${to} by ${rotation}° clockwise.` : `Rotated all ${pageCount} pages by ${rotation}° clockwise.` });
    } catch (err) {
      setError("Rotation failed. The file may be damaged or password-protected. (" + (err?.message || "unknown error") + ")");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <p className="notice info">Rotate PDF pages by 90, 180 or 270 degrees — free, in your browser. Nothing is uploaded: rotation runs locally with pdf-lib. Handy for sideways scans and upside-down pages.</p>
      <label htmlFor="rp-file">Upload a PDF (up to 20 MB)</label>
      <input id="rp-file" type="file" accept="application/pdf,.pdf" onChange={onFile} />
      {file && <p>{file.name} — {formatBytes(file.size)}{pageCount ? ` · ${pageCount} pages` : ""}</p>}
      <label htmlFor="rp-degrees">Rotation (clockwise)</label>
      <select id="rp-degrees" value={rotation} onChange={(e) => setRotation(Number(e.target.value))}>
        <option value={90}>90° clockwise</option>
        <option value={180}>180° (upside down)</option>
        <option value={270}>90° counter-clockwise</option>
      </select>
      <fieldset>
        <legend>Which pages?</legend>
        <label><input type="radio" name="rp-scope" value="all" checked={scope === "all"} onChange={() => setScope("all")} /> All pages</label>
        <label style={{ marginLeft: 16 }}><input type="radio" name="rp-scope" value="range" checked={scope === "range"} onChange={() => setScope("range")} /> A page range</label>
      </fieldset>
      {scope === "range" && pageCount > 0 && (
        <div className="toolbar">
          <label htmlFor="rp-from">From page</label>
          <input id="rp-from" type="number" min="1" max={pageCount} value={from} onChange={(e) => setFrom(Number(e.target.value))} style={{ width: 80 }} />
          <label htmlFor="rp-to">to page</label>
          <input id="rp-to" type="number" min="1" max={pageCount} value={to} onChange={(e) => setTo(Number(e.target.value))} style={{ width: 80 }} />
        </div>
      )}
      <div className="toolbar"><button type="button" className="btn" disabled={busy || !file} onClick={rotate}>{busy ? "Rotating…" : "Rotate PDF"}</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {out && (
        <div className="output">
          <p className="success">{out.note}</p>
          <div className="toolbar"><button type="button" className="btn" onClick={() => downloadBlob(out.name, out.blob)}>Download Rotated PDF</button></div>
        </div>
      )}
    </div>
  );
}
