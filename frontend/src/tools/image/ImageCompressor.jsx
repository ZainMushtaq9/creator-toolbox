import { useState, useEffect } from "react";
import { downloadBlob } from "../../utils/format.js";

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [quality, setQuality] = useState(0.8);
  const [out, setOut] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Patch 043: revoke preview/output object URLs when replaced or on
  // unmount — previously every upload/compress leaked a blob URL.
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => () => { if (out?.url) URL.revokeObjectURL(out.url); }, [out?.url]);
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("File is over the 20 MB limit."); return; }
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setError("Please choose a JPG, PNG or WebP image."); return; }
    setError(""); setFile(f); setPreview(URL.createObjectURL(f)); setOut(null);
  };
  const compress = async () => {
    if (!file) { setError("Upload an image first."); return; }
    setBusy(true); setError("");
    try {
      const imageCompression = (await import("browser-image-compression")).default;
      const opts = { maxSizeMB: 5, maxWidthOrHeight: 4000, useWebWorker: true, initialQuality: quality };
      const blob = await imageCompression(file, opts);
      setOut({ blob, url: URL.createObjectURL(blob), name: file.name.replace(/\.[^.]+$/, "") + "-compressed." + (file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg") });
    } catch (err) {
      setError("Compression failed in this browser. Try a smaller image or a different browser. (" + (err?.message || "unknown error") + ")");
    } finally { setBusy(false); }
  };
  return (
    <div>
      <p className="notice info">Local only — compression runs in your browser (browser-image-compression). Nothing is uploaded. PNG transparency is preserved when the output is PNG/WebP; JPG cannot store transparency.</p>
      <label htmlFor="ic-file">Upload an image (JPG, PNG or WebP, up to 20 MB)</label>
      <input id="ic-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} />
      <label htmlFor="ic-quality">Quality: {Math.round(quality * 100)}%</label>
      <input id="ic-quality" type="range" min="0.3" max="0.95" step="0.05" value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: "100%" }} />
      <div className="toolbar"><button type="button" className="btn" disabled={busy} onClick={compress}>{busy ? "Compressing…" : "Compress Image"}</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {file && <p>Original: {file.name} — {(file.size / 1024).toFixed(0)} KB {preview && <span>· <img className="preview" src={preview} alt="Original upload preview" /></span>}</p>}
      {out && (
        <div>
          <p className="success">Compressed: {(out.blob.size / 1024).toFixed(0)} KB — saved {file ? Math.max(0, Math.round((1 - out.blob.size / file.size) * 100)) : 0}% vs the original.</p>
          <p><img className="preview" src={out.url} alt="Compressed image preview" /></p>
          <div className="toolbar"><button type="button" className="btn" onClick={() => downloadBlob(out.name, out.blob)}>Download Compressed Image</button></div>
        </div>
      )}
    </div>
  );
}
