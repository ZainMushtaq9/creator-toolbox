import { useState, useRef } from "react";
import { downloadBlob } from "../../utils/format.js";

// HTML to PDF: renders pasted HTML in a preview box, then captures it to
// a PDF with html2pdf.js (html2canvas + jsPDF), all in the browser.
// Honest limits: scripts do not run, and complex CSS (flexbox/grid edge
// cases, web fonts, external images) may render differently than in a
// browser — the preview shows what will be captured.
const SAMPLE = `<h2>Invoice #1024</h2>
<p><strong>From:</strong> Your Business<br>
<strong>To:</strong> Your Customer</p>
<table border="1" cellpadding="6">
  <tr><th>Item</th><th>Price</th></tr>
  <tr><td>Design work</td><td>$150</td></tr>
  <tr><td>Hosting (1 year)</td><td>$60</td></tr>
</table>
<p><strong>Total: $210</strong></p>`;

export default function HtmlToPdf() {
  const [html, setHtml] = useState(SAMPLE);
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const previewRef = useRef(null);

  const convert = async () => {
    if (!html.trim()) { setError("Paste some HTML first — or use the sample invoice above."); return; }
    setBusy(true); setError(""); setDone(false);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 10,
        filename: "page.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: pageSize, orientation },
        pagebreak: { mode: ["css", "legacy"] },
      };
      await html2pdf().set(opt).from(previewRef.current).save();
      setDone(true);
    } catch (err) {
      setError("Conversion failed. Very large pages or unsupported CSS can break the renderer — simplify the HTML and try again. (" + (err?.message || "unknown error") + ")");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <p className="notice info">Convert HTML code into a PDF — free, in your browser. Nothing is uploaded: the page is rendered and captured locally. Scripts do not run, and some complex CSS may render differently — the preview below shows exactly what will be captured.</p>
      <label htmlFor="hp-html">HTML code</label>
      <textarea id="hp-html" value={html} onChange={(e) => setHtml(e.target.value)} rows={10} style={{ width: "100%", fontFamily: "monospace" }} spellCheck={false} />
      <div className="toolbar">
        <label htmlFor="hp-size">Page size</label>
        <select id="hp-size" value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
        </select>
        <label htmlFor="hp-orient">Orientation</label>
        <select id="hp-orient" value={orientation} onChange={(e) => setOrientation(e.target.value)}>
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
        <button type="button" className="btn" disabled={busy} onClick={convert}>{busy ? "Converting…" : "Convert HTML to PDF"}</button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {done && <p className="success output">PDF downloaded. If the layout looks off, simplify the CSS — the renderer handles basic layouts best.</p>}
      <h3 style={{ marginTop: 20 }}>Preview (what will be captured)</h3>
      <div ref={previewRef} style={{ border: "1px solid var(--border, #ccc)", borderRadius: 6, padding: 16, background: "#fff", color: "#111" }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
