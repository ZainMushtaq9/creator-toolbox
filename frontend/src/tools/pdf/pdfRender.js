// PDF.js helpers (browser-only). Imported lazily by the tools that need
// rendering or text extraction, so pdfjs-dist never lands in the homepage
// bundle. The worker is bundled by Vite via the ?url import and served
// from the same site — no third-party CDN is involved.
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

let pdfjsLib = null;
async function getPdfJs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  }
  return pdfjsLib;
}

export async function loadPdfDocument(bytes) {
  const pdfjs = await getPdfJs();
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return pdfjs.getDocument({ data }).promise;
}

export async function getPdfPageCountJs(bytes) {
  const doc = await loadPdfDocument(bytes);
  const n = doc.numPages;
  await doc.destroy();
  return n;
}

// Extracts the text of each page: [{ page, text }]. Calls onProgress
// (done, total) after each page. Scanned/image PDFs have no text layer
// and return empty strings — callers say so honestly on the page.
export async function extractPdfText(bytes, onProgress) {
  const doc = await loadPdfDocument(bytes);
  const pages = [];
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((it) => (typeof it.str === "string" ? it.str : "")).join(" ");
      pages.push({ page: i, text: text.replace(/\s+/g, " ").trim() });
      if (onProgress) onProgress(i, doc.numPages);
    }
  } finally {
    await doc.destroy();
  }
  return pages;
}

// Renders one page (1-based) to an image Blob. scale 2 ≈ 144 dpi.
export async function renderPdfPageToBlob(bytes, pageNum, { scale = 2, format = "png", quality = 0.92 } = {}) {
  const doc = await loadPdfDocument(bytes);
  try {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;
    const mime = format === "jpg" ? "image/jpeg" : "image/png";
    return await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
  } finally {
    await doc.destroy();
  }
}

// Renders one page to a canvas element (used by the OCR tool, which
// feeds the canvas to Tesseract without an intermediate file).
export async function renderPdfPageToCanvas(bytes, pageNum, scale = 2) {
  const doc = await loadPdfDocument(bytes);
  try {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas;
  } finally {
    await doc.destroy();
  }
}
