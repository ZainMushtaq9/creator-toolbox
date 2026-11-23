import { useState } from "react";
import { formatBytes, validatePdfFile, parsePageRanges } from "./pdfSmall.js";
import { downloadBlob } from "../../utils/format.js";

export default function SplitPdf() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState("range");
  const [range, setRange] = useState("");
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
      setError("That file could not be read. It may be damaged or password-protected — encrypted PDFs cannot be split in the browser.");
      setFile(null);
    }
  };

  const base = file ? file.name.replace(/\.pdf$/i, "") : "document";
  const split = async () => {
    if (!file || !pageCount) { setError("Upload a PDF first."); return; }
    setBusy(true); setError(""); setOut(null);
    try {
      const { splitPdfRange, splitPdfAll, readFileBytes } = await import("./pdfUtils.js");
      const bytes = await readFileBytes(file);
      if (mode === "range") {
        const { pages, error: rangeErr } = parsePageRanges(range, pageCount);
        if (rangeErr) { setError(rangeErr); setBusy(false); return; }
        const part = await splitPdfRange(bytes, pages[0], pages[pages.length - 1]);
        const blob = new Blob([part], { type: "application/pdf" });
        setOut({ parts: [{ blob, name: `${base}-pages-${pages[0]}-${pages[pages.length - 1]}.pdf` }], note: `Extracted pages ${pages[0]}–${pages[pages.length - 1]} (${pages.length} page${pages.length > 1 ? "s" : ""}).` });
      } else {
        const all = await splitPdfAll(bytes);
        setOut({
          parts: all.map((b, i) => ({ blob: new Blob([b], { type: "application/pdf" }), name: `${base}-page-${i + 1}.pdf` })),
          note: `Split into ${all.length} single-page PDFs.`,
        });
      }
    } catch (err) {
      setError("Splitting failed. The file may be damaged or password-protected. (" + (err?.message || "unknown error") + ")");
    } finally { setBusy(false); }
  };

  const downloadAll = async () => {
    if (!out) return;
    for (const p of out.parts) {
      downloadBlob(p.name, p.blob);
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  return (
    <div>
      <p className="notice info">Split a PDF into single pages, or extract just the pages you need — free, in your browser. Nothing is uploaded: splitting runs locally with pdf-lib.</p>
      <label htmlFor="sp-file">Upload a PDF (up to 20 MB)</label>
      <input id="sp-file" type="file" accept="application/pdf,.pdf" onChange={onFile} />
      {file && <p>{file.name} — {formatBytes(file.size)}{pageCount ? ` · ${pageCount} pages` : ""}</p>}
      <fieldset>
        <legend>Split mode</legend>
        <label><input type="radio" name="sp-mode" value="range" checked={mode === "range"} onChange={() => setMode("range")} /> Extract a page range</label>
        <label style={{ marginLeft: 16 }}><input type="radio" name="sp-mode" value="all" checked={mode === "all"} onChange={() => setMode("all")} /> Split into single pages</label>
      </fieldset>
      {mode === "range" && (
        <div>
          <label htmlFor="sp-range">Pages to extract (e.g. 1-3, 5){pageCount ? ` — this PDF has ${pageCount} pages` : ""}</label>
          <input id="sp-range" type="text" inputMode="text" placeholder="1-3, 5" value={range} onChange={(e) => setRange(e.target.value)} />
        </div>
      )}
      <div className="toolbar"><button type="button" className="btn" disabled={busy || !file} onClick={split}>{busy ? "Splitting…" : "Split PDF"}</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {out && (
        <div className="output">
          <p className="success">{out.note}</p>
          <ul className="result-list">
            {out.parts.map((p) => (
              <li key={p.name}><span>{p.name}</span><button type="button" className="btn btn-sm secondary" onClick={() => downloadBlob(p.name, p.blob)}>Download</button></li>
            ))}
          </ul>
          {out.parts.length > 1 && (
            <div className="toolbar"><button type="button" className="btn secondary" onClick={downloadAll}>Download all ({out.parts.length} files)</button><span style={{ fontSize: ".9rem", opacity: .8 }}>Your browser may ask permission for multiple downloads.</span></div>
          )}
        </div>
      )}
    </div>
  );
}
