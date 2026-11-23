import { useState } from "react";
import { formatBytes, validatePdfFile } from "./pdfSmall.js";
import { downloadBlob } from "../../utils/format.js";

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [out, setOut] = useState(null);
  const [empty, setEmpty] = useState(false);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validatePdfFile(f);
    if (err) { setError(err); return; }
    setError(""); setFile(f); setOut(null); setEmpty(false);
  };

  const convert = async () => {
    if (!file) { setError("Upload a PDF first."); return; }
    setBusy(true); setError(""); setOut(null); setEmpty(false);
    try {
      const { extractPdfText } = await import("./pdfRender.js");
      const { readFileBytes } = await import("./pdfUtils.js");
      const pages = await extractPdfText(await readFileBytes(file), (done, total) => setProgress(`Reading page ${done} of ${total}…`));
      const joined = pages.map((p) => p.text).join(" ").trim();
      if (!joined) { setEmpty(true); setProgress(""); setBusy(false); return; }
      setProgress("Building the Word document…");
      const { textPagesToDocx } = await import("./pdfDocx.js");
      const blob = await textPagesToDocx(pages, file.name.replace(/\.pdf$/i, ""));
      setProgress("");
      setOut({ blob, name: file.name.replace(/\.pdf$/i, "") + ".docx", note: `Converted ${pages.length} page${pages.length > 1 ? "s" : ""} to an editable Word document (${joined.length.toLocaleString()} characters).` });
    } catch (err) {
      setError("Conversion failed. The file may be damaged or password-protected — encrypted PDFs cannot be converted in the browser. (" + (err?.message || "unknown error") + ")");
      setProgress("");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <p className="notice info">Convert a PDF to an editable Word (.docx) file — free, in your browser. Nothing is uploaded. This is a TEXT-based conversion: it extracts the PDF&apos;s text into editable paragraphs. It does not rebuild the original layout, fonts, tables or images — a layout-perfect conversion needs a server-side engine.</p>
      <label htmlFor="pw-file">Upload a PDF (up to 20 MB)</label>
      <input id="pw-file" type="file" accept="application/pdf,.pdf" onChange={onFile} />
      {file && <p>{file.name} — {formatBytes(file.size)}</p>}
      <div className="toolbar"><button type="button" className="btn" disabled={busy || !file} onClick={convert}>{busy ? "Converting…" : "Convert PDF to Word"}</button></div>
      {progress && <p role="status">{progress}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {empty && (
        <div className="output">
          <p className="notice info">No text was found in this PDF — it is probably a scanned document (pages are images, not text). A text-based conversion cannot work on it; try the OCR tool first to read the text, then paste it into Word.</p>
        </div>
      )}
      {out && (
        <div className="output">
          <p className="success">{out.note}</p>
          <p style={{ fontSize: ".9rem", opacity: .8 }}>The Word file holds the extracted text as editable paragraphs. Check the formatting in Word — headings, columns and tables from the PDF are not preserved.</p>
          <div className="toolbar"><button type="button" className="btn" onClick={() => downloadBlob(out.name, out.blob)}>Download Word Document</button></div>
        </div>
      )}
    </div>
  );
}
