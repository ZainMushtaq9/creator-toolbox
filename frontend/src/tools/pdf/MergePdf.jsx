import { useState } from "react";
import { MAX_MERGE_FILES, formatBytes, formatPageCount, formatMergeResult, validatePdfFile } from "./pdfSmall.js";
import { downloadBlob } from "../../utils/format.js";

export default function MergePdf() {
  // Entries are { file, pages } — the page count is read when the file is
  // added (Patch 051) so the list and the result can both show it.
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState(null);

  const onFiles = async (e) => {
    const picked = [...(e.target.files || [])];
    if (!picked.length) return;
    for (const f of picked) {
      const err = validatePdfFile(f);
      if (err) { setError(err); return; }
    }
    if (files.length + picked.length > MAX_MERGE_FILES) { setError(`Merge at most ${MAX_MERGE_FILES} PDFs at a time.`); return; }
    setError("");
    try {
      const { getPdfPageCount, readFileBytes } = await import("./pdfUtils.js");
      const entries = [];
      for (const f of picked) {
        entries.push({ file: f, pages: await getPdfPageCount(await readFileBytes(f)) });
      }
      setFiles((prev) => [...prev, ...entries]);
      setOut(null);
    } catch {
      setError("One of the files could not be read. It may be damaged or password-protected — encrypted PDFs cannot be merged in the browser.");
    }
    e.target.value = "";
  };
  const move = (i, dir) => {
    setFiles((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const remove = (i) => setFiles((prev) => prev.filter((_, k) => k !== i));

  const merge = async () => {
    if (files.length < 2) { setError("Add at least 2 PDFs to merge."); return; }
    setBusy(true); setError("");
    try {
      const { mergePdfs, getPdfPageCount, readFileBytes } = await import("./pdfUtils.js");
      const parts = [];
      for (const { file } of files) parts.push(await readFileBytes(file));
      const bytes = await mergePdfs(parts);
      const totalPages = await getPdfPageCount(bytes);
      const blob = new Blob([bytes], { type: "application/pdf" });
      setOut({ blob, name: "merged.pdf", size: bytes.length, pages: totalPages });
    } catch (err) {
      setError("Merging failed. One of the files may be damaged or password-protected — encrypted PDFs cannot be merged in the browser. (" + (err?.message || "unknown error") + ")");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <p className="notice info">Yes — combine up to {MAX_MERGE_FILES} PDFs into one file, free, in your browser. Nothing is uploaded: merging runs locally with pdf-lib, and your files never leave your device.</p>
      <label htmlFor="mp-files">Add PDF files (up to {MAX_MERGE_FILES}, 20 MB each)</label>
      <input id="mp-files" type="file" accept="application/pdf,.pdf" multiple onChange={onFiles} />
      {files.length > 0 && (
        <ol className="result-list" aria-label="Files to merge, in order">
          {files.map((entry, i) => (
            <li key={`${entry.file.name}-${i}`}>
              <span>{i + 1}. {entry.file.name} — {formatBytes(entry.file.size)} · {formatPageCount(entry.pages)}</span>
              <span className="toolbar" style={{ display: "inline-flex", gap: 4, marginLeft: 8 }}>
                <button type="button" className="btn btn-sm secondary" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${entry.file.name} up`}>↑</button>
                <button type="button" className="btn btn-sm secondary" disabled={i === files.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${entry.file.name} down`}>↓</button>
                <button type="button" className="btn btn-sm ghost" onClick={() => remove(i)} aria-label={`Remove ${entry.file.name}`}>Remove</button>
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="toolbar"><button type="button" className="btn" disabled={busy || files.length < 2} onClick={merge}>{busy ? "Merging…" : "Merge PDFs"}</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {out && (
        <div className="output">
          <p className="success">{formatMergeResult(files.length, out.pages, out.size)}</p>
          <div className="toolbar"><button type="button" className="btn" onClick={() => downloadBlob(out.name, out.blob)}>Download Merged PDF</button></div>
        </div>
      )}
    </div>
  );
}
