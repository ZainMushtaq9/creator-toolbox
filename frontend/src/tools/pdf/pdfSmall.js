// Tiny dependency-free PDF helpers — safe to import statically from any
// tool component (adds nothing to the bundle). The heavy libraries
// (pdf-lib, pdfjs-dist, docx, tesseract.js, html2pdf.js) are always
// dynamic-imported inside event handlers so the homepage bundle stays
// light. pdfUtils.js re-exports these for the unit tests.
export const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20 MB, same as the image tools
export const MAX_MERGE_FILES = 20;
export const MAX_OCR_PAGES = 10;

export function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function validatePdfFile(file, maxBytes = MAX_PDF_BYTES) {
  if (!file) return "Choose a PDF file first.";
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name || "");
  if (!isPdf) return "Please choose a PDF file.";
  if (file.size > maxBytes) return `File is over the ${formatBytes(maxBytes)} limit.`;
  return "";
}

// "1 page" / "3 pages" — used by the Merge PDF file list and result.
export function formatPageCount(n) {
  return `${n} page${n === 1 ? "" : "s"}`;
}

// Merge PDF success message: file count, total page count, output size.
export function formatMergeResult(fileCount, totalPages, size) {
  return `Merged ${fileCount} PDFs (${formatPageCount(totalPages)}) into one file — ${formatBytes(size)}.`;
}

export function validateImageFile(file, maxBytes = MAX_PDF_BYTES) {
  if (!file) return "Choose an image first.";
  const ok = /^image\/(jpeg|png)$/.test(file.type) || /\.(jpe?g|png)$/i.test(file.name || "");
  if (!ok) return "Please choose a JPG or PNG image.";
  if (file.size > maxBytes) return `File is over the ${formatBytes(maxBytes)} limit.`;
  return "";
}

// Parses "1-3, 5, 7" into a sorted unique array of 1-based page numbers
// within [1, pageCount]. Returns { pages, error } — error is "" when valid.
export function parsePageRanges(spec, pageCount) {
  const pages = new Set();
  const parts = String(spec || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return { pages: [], error: "Enter at least one page or range, e.g. 1-3, 5." };
  for (const part of parts) {
    const m = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);
    if (!m) return { pages: [], error: `"${part}" is not a page number or range (use e.g. 1-3, 5).` };
    const from = Number(m[1]);
    const to = m[2] ? Number(m[2]) : from;
    if (from < 1 || to > pageCount || from > to) {
      return { pages: [], error: `Pages must be between 1 and ${pageCount}.` };
    }
    for (let i = from; i <= to; i++) pages.add(i);
  }
  return { pages: [...pages].sort((a, b) => a - b), error: "" };
}
