// Unit tests for the PDF toolkit (Patch 050) — pure pdf-lib logic only.
// Run: `npm test` (repo root). Fixtures are generated in-memory with
// pdf-lib (no checked-in binary files); the 8x8 JPEG/PNG fixtures below
// were generated with Pillow. PDF.js rendering, Tesseract OCR and
// html2pdf capture are browser-only and are NOT covered here — they are
// exercised by hand in the browser (see tests/unit/tools.test.md).
import { test } from "node:test";
import assert from "node:assert/strict";

import pkg from "../../frontend/node_modules/pdf-lib/cjs/index.js";
import {
  mergePdfs, splitPdfRange, splitPdfAll, rotatePdf, compressPdf,
  watermarkPdf, addPageNumbers, imagesToPdf, signPdf, getPdfPageCount,
  parsePageRanges, formatBytes, validatePdfFile,
} from "../../frontend/src/tools/pdf/pdfUtils.js";
import { textPagesToDocx } from "../../frontend/src/tools/pdf/pdfDocx.js";

const { PDFDocument, StandardFonts } = pkg;

// 8x8 red JPEG and 8x8 blue PNG, generated with Pillow.
const JPG_B64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDwKiiivzI/uM//2Q==";
const PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAFklEQVR4nGOUqzjxnwEPYMInOXwUAABx7AJtOn2KvAAAAABJRU5ErkJggg==";

async function makePdf(pages, label) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pages; i++) {
    const page = doc.addPage([400, 300]);
    page.drawText(`${label} page ${i + 1}`, { x: 10, y: 10, size: 12, font });
  }
  return doc.save();
}

async function pageRotations(bytes) {
  const doc = await PDFDocument.load(bytes);
  return doc.getPages().map((p) => p.getRotation().angle);
}

test("mergePdfs joins two PDFs in order", async () => {
  const a = await makePdf(3, "A");
  const b = await makePdf(2, "B");
  const merged = await mergePdfs([a, b]);
  assert.equal(await getPdfPageCount(merged), 5);
});

test("splitPdfRange extracts a page range", async () => {
  const src = await makePdf(5, "doc");
  const part = await splitPdfRange(src, 2, 3);
  assert.equal(await getPdfPageCount(part), 2);
  const single = await splitPdfRange(src, 4, 4);
  assert.equal(await getPdfPageCount(single), 1);
});

test("splitPdfAll splits into one single-page PDF per page", async () => {
  const src = await makePdf(3, "doc");
  const parts = await splitPdfAll(src);
  assert.equal(parts.length, 3);
  for (const part of parts) assert.equal(await getPdfPageCount(part), 1);
});

test("rotatePdf rotates all pages by the given angle", async () => {
  const src = await makePdf(3, "doc");
  const out = await rotatePdf(src, 90);
  assert.deepEqual(await pageRotations(out), [90, 90, 90]);
});

test("rotatePdf rotates only the requested page range", async () => {
  const src = await makePdf(3, "doc");
  const out = await rotatePdf(src, 180, 2, 2);
  assert.deepEqual(await pageRotations(out), [0, 180, 0]);
});

test("compressPdf returns a valid PDF with the same page count", async () => {
  const src = await makePdf(3, "doc");
  const result = await compressPdf(src);
  assert.ok(result.bytes instanceof Uint8Array);
  assert.equal(await getPdfPageCount(result.bytes), 3);
  assert.equal(typeof result.saved, "number");
  assert.equal(typeof result.smaller, "boolean");
});

test("watermarkPdf keeps the page count", async () => {
  const src = await makePdf(2, "doc");
  const out = await watermarkPdf(src, { text: "DRAFT", opacity: 0.25, fontSize: 48 });
  assert.equal(await getPdfPageCount(out), 2);
});

test("addPageNumbers keeps the page count", async () => {
  const src = await makePdf(4, "doc");
  const out = await addPageNumbers(src, { position: "bottom-right", startAt: 5, format: "n-of-m" });
  assert.equal(await getPdfPageCount(out), 4);
});

test("imagesToPdf builds one page per image (JPG and PNG)", async () => {
  const jpg = new Uint8Array(Buffer.from(JPG_B64, "base64"));
  const png = new Uint8Array(Buffer.from(PNG_B64, "base64"));
  const out = await imagesToPdf([{ bytes: jpg, type: "jpg" }, { bytes: png, type: "png" }]);
  assert.equal(await getPdfPageCount(out), 2);
});

test("signPdf stamps a signature image and keeps the page count", async () => {
  const src = await makePdf(2, "doc");
  const png = new Uint8Array(Buffer.from(PNG_B64, "base64"));
  const out = await signPdf(src, { imageBytes: png, imageType: "png", page: 2, position: "bottom-right", width: 120 });
  assert.equal(await getPdfPageCount(out), 2);
});

test("getPdfPageCount counts pages", async () => {
  const src = await makePdf(4, "doc");
  assert.equal(await getPdfPageCount(src), 4);
});

test("parsePageRanges parses ranges, dedupes and rejects bad input", () => {
  assert.deepEqual(parsePageRanges("1-3, 5", 5), { pages: [1, 2, 3, 5], error: "" });
  assert.deepEqual(parsePageRanges("2, 2, 1", 5), { pages: [1, 2], error: "" });
  assert.equal(parsePageRanges("0", 5).error.length > 0, true);
  assert.equal(parsePageRanges("6", 5).error.length > 0, true);
  assert.equal(parsePageRanges("3-2", 5).error.length > 0, true);
  assert.equal(parsePageRanges("abc", 5).error.length > 0, true);
  assert.equal(parsePageRanges("", 5).error.length > 0, true);
});

test("formatBytes formats B, KB and MB", () => {
  assert.equal(formatBytes(500), "500 B");
  assert.equal(formatBytes(2048), "2 KB");
  assert.equal(formatBytes(3 * 1024 * 1024), "3.00 MB");
});

test("validatePdfFile accepts PDFs and rejects the rest", () => {
  assert.equal(validatePdfFile({ name: "a.pdf", type: "application/pdf", size: 1000 }), "");
  assert.equal(validatePdfFile({ name: "a.PDF", type: "", size: 1000 }), "");
  assert.ok(validatePdfFile({ name: "a.png", type: "image/png", size: 1000 }).length > 0);
  assert.ok(validatePdfFile({ name: "a.pdf", type: "application/pdf", size: 21 * 1024 * 1024 }).length > 0);
});

test("textPagesToDocx produces a non-empty .docx blob", async () => {
  const blob = await textPagesToDocx(
    [{ page: 1, text: "hello world" }, { page: 2, text: "second page" }],
    "Test",
  );
  assert.ok(blob.size > 0);
  assert.equal(blob.type, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
});
