export function copyText(text, onDone) {
  if (!text) return;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => onDone?.("Copied to clipboard.")).catch(() => fallbackCopy(text, onDone));
  } else fallbackCopy(text, onDone);
}
function fallbackCopy(text, onDone) {
  const ta = document.createElement("textarea");
  ta.value = text; document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); onDone?.("Copied to clipboard."); } catch { onDone?.("Copy failed — select the text manually."); }
  document.body.removeChild(ta);
}
export function downloadText(filename, text, mime = "text/plain") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
export function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
export function gcd(a, b) { return b ? gcd(b, a % b) : a; }
export function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
