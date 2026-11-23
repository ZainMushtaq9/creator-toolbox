import { useState } from "react";
import { formatBytes, validatePdfFile } from "./pdfSmall.js";
import { downloadBlob } from "../../utils/format.js";

export default function CompressPdf() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState(null);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validatePdfFile(f);
    if (err) { setError(err); return; }
    setError(""); setFile(f); setOut(null);
  };

  const compress = async () => {
    if (!file) { setError("Upload a PDF first."); return; }
    setBusy(true); setError("");
    try {
      const { compressPdf, readFileBytes } = await import("./pdfUtils.js");
      const bytes = await readFileBytes(file);
      const result = await compressPdf(bytes);
      const blob = new Blob([result.bytes], { type: "application/pdf" });
      const pct = result.saved > 0 ? Math.round((result.saved / file.size) * 100) : 0;
      setOut({
        blob,
        name: file.name.replace(/\.pdf$/i, "") + "-compressed.pdf",
        size: result.bytes.length,
        pct,
        smaller: result.smaller,
      });
    } catch (err) {
      setError("Compression failed. The file may be damaged or password-protected — encrypted PDFs cannot be compressed in the browser. (" + (err?.message || "unknown error") + ")");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <p className="notice info">Reduce a PDF&apos;s file size in your browser — free, no upload. Honest limits: this re-saves the PDF with compressed object streams, so typical savings are small (often 0–20%) because most PDFs are already compressed. It does not re-encode embedded images.</p>
      <label htmlFor="cp-file">Upload a PDF (up to 20 MB)</label>
      <input id="cp-file" type="file" accept="application/pdf,.pdf" onChange={onFile} />
      {file && <p>Original: {file.name} — {formatBytes(file.size)}</p>}
      <div className="toolbar"><button type="button" className="btn" disabled={busy || !file} onClick={compress}>{busy ? "Compressing…" : "Compress PDF"}</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {out && (
        <div className="output">
          {out.smaller ? (
            <p className="success">Compressed: {formatBytes(out.size)} — saved {out.pct}% vs the original ({formatBytes(file.size)}).</p>
          ) : (
            <p className="success">No saving this time — your PDF was already compressed, so the file is unchanged at {formatBytes(out.size)}. The download below is the original file.</p>
          )}
          <div className="toolbar"><button type="button" className="btn" onClick={() => downloadBlob(out.name, out.blob)}>Download Compressed PDF</button></div>
        </div>
      )}
    </div>
  );
}
