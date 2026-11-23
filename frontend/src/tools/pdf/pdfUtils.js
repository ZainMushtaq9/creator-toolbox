// Shared PDF helpers for the PDF toolkit (Patch 050).
// pdf-lib ONLY in this module — it is pure JavaScript with no browser
// dependency, so the unit tests (tests/unit/pdf.test.mjs) import it
// directly in Node. PDF.js rendering / text extraction lives in
// pdfRender.js (browser-only) and .docx generation in pdfDocx.js.
// Everything here runs 100% in the browser: no file is ever uploaded.
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { formatBytes } from "./pdfSmall.js";

export { MAX_PDF_BYTES, MAX_MERGE_FILES, MAX_OCR_PAGES, formatBytes, formatPageCount, formatMergeResult, validatePdfFile, validateImageFile, parsePageRanges } from "./pdfSmall.js";

export async function readFileBytes(file) {
  return new Uint8Array(await file.arrayBuffer());
}

export function downloadBytes(filename, bytes, mime = "application/pdf") {
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function getPdfPageCount(bytes) {
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

export async function mergePdfs(listOfBytes) {
  const out = await PDFDocument.create();
  for (const bytes of listOfBytes) {
    const src = await PDFDocument.load(bytes);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  return out.save();
}

export async function splitPdfRange(bytes, start, end) {
  // 1-based inclusive page numbers.
  const src = await PDFDocument.load(bytes);
  const total = src.getPageCount();
  const from = Math.max(1, Math.min(start, total));
  const to = Math.max(from, Math.min(end, total));
  const indices = [];
  for (let i = from - 1; i < to; i++) indices.push(i);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

export async function splitPdfAll(bytes) {
  const src = await PDFDocument.load(bytes);
  const out = [];
  for (const i of src.getPageIndices()) {
    const doc = await PDFDocument.create();
    const [page] = await doc.copyPages(src, [i]);
    doc.addPage(page);
    out.push(await doc.save());
  }
  return out;
}

export async function rotatePdf(bytes, rotation, start = 1, end = null) {
  const doc = await PDFDocument.load(bytes);
  const total = doc.getPageCount();
  const from = Math.max(1, Math.min(start, total));
  const to = end === null ? total : Math.max(from, Math.min(end, total));
  for (let i = from - 1; i < to; i++) {
    const page = doc.getPage(i);
    page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
  }
  return doc.save();
}

// Honest compression: pdf-lib re-saves with compressed object streams.
// Most PDFs are already compressed, so typical savings are small (often
// 0–20%). This does NOT re-encode embedded images — that is what would
// shrink an image-heavy PDF, and no free client-side library does it
// reliably. If the re-save is not smaller, the original bytes are kept.
export async function compressPdf(bytes) {
  const doc = await PDFDocument.load(bytes);
  const saved = await doc.save({ useObjectStreams: true });
  if (saved.length >= bytes.length) return { bytes, saved: 0, smaller: false };
  return { bytes: saved, saved: bytes.length - saved.length, smaller: true };
}

export async function watermarkPdf(bytes, { text, opacity = 0.25, fontSize = 48 } = {}) {
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(-45),
    });
  }
  return doc.save();
}

export async function addPageNumbers(bytes, { position = "bottom-center", startAt = 1, format = "n", fontSize = 11 } = {}) {
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const total = doc.getPageCount();
  doc.getPages().forEach((page, i) => {
    const n = startAt + i;
    const label = format === "page-n" ? `Page ${n}` : format === "n-of-m" ? `${n} of ${total}` : `${n}`;
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(label, fontSize);
    const margin = 24;
    let x = (width - textWidth) / 2;
    let y = margin;
    if (position === "bottom-right") x = width - textWidth - margin;
    else if (position === "bottom-left") x = margin;
    else if (position === "top-center") y = height - margin - fontSize;
    else if (position === "top-right") { x = width - textWidth - margin; y = height - margin - fontSize; }
    else if (position === "top-left") { x = margin; y = height - margin - fontSize; }
    page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
  });
  return doc.save();
}

export async function imagesToPdf(images) {
  // images: [{ bytes, type: "jpg" | "png" }]. One image per A4 page,
  // scaled to fit with a margin. Returns the PDF bytes.
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  const MARGIN = 36;
  const doc = await PDFDocument.create();
  for (const img of images) {
    const embedded = img.type === "png" ? await doc.embedPng(img.bytes) : await doc.embedJpg(img.bytes);
    const page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
    const { width, height } = embedded.scaleToFit(A4_WIDTH - MARGIN * 2, A4_HEIGHT - MARGIN * 2);
    page.drawImage(embedded, { x: (A4_WIDTH - width) / 2, y: (A4_HEIGHT - height) / 2, width, height });
  }
  return doc.save();
}

export async function signPdf(bytes, { imageBytes, imageType, page = 1, position = "bottom-right", width = 180 } = {}) {
  const doc = await PDFDocument.load(bytes);
  const total = doc.getPageCount();
  const target = doc.getPage(Math.max(0, Math.min(page - 1, total - 1)));
  const embedded = imageType === "png" ? await doc.embedPng(imageBytes) : await doc.embedJpg(imageBytes);
  const aspect = embedded.height / embedded.width;
  const height = width * aspect;
  const { width: pageWidth, height: pageHeight } = target.getSize();
  const margin = 36;
  let x = pageWidth - width - margin;
  let y = margin;
  if (position === "bottom-left") x = margin;
  else if (position === "bottom-center") x = (pageWidth - width) / 2;
  else if (position === "top-right") y = pageHeight - height - margin;
  else if (position === "top-left") { x = margin; y = pageHeight - height - margin; }
  else if (position === "center") { x = (pageWidth - width) / 2; y = (pageHeight - height) / 2; }
  target.drawImage(embedded, { x, y, width, height });
  return doc.save();
}
