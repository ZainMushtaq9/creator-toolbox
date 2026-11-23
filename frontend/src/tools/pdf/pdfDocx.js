// Text-based PDF → Word conversion (browser + Node safe — the `docx`
// library is pure JavaScript). Honest scope: this extracts the PDF's
// text and writes it as editable paragraphs in a .docx file. It does
// NOT rebuild the original layout, fonts, tables or images — a
// layout-perfect conversion needs a server-side engine and is out of
// scope for a free client-side tool. The tool page says this plainly.
import { Document, Packer, Paragraph, TextRun, PageBreak } from "docx";

export async function textPagesToDocx(pages, title = "Converted document") {
  const children = [];
  pages.forEach((p, idx) => {
    if (idx > 0) children.push(new Paragraph({ children: [new PageBreak()] }));
    const lines = String(p.text || "").split(/\n+/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) {
      children.push(new Paragraph({ children: [new TextRun({ text: "", })] }));
      return;
    }
    for (const line of lines) {
      children.push(new Paragraph({ children: [new TextRun({ text: line })] }));
    }
  });
  const doc = new Document({
    title,
    creator: "CreatorToolbox",
    description: "Text extracted from a PDF in the browser with CreatorToolbox.",
    sections: [{ children }],
  });
  return Packer.toBlob(doc);
}
