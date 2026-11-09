import { useState, useEffect, useRef } from "react";
import { downloadBlob } from "../../utils/format.js";

export default function ImageResizer() {
  const [img, setImg] = useState(null);
  const [width, setWidth] = useState("1200");
  const [height, setHeight] = useState("900");
  const [lock, setLock] = useState(true);
  const [mode, setMode] = useState("fit");
  const [format, setFormat] = useState("jpeg");
  const [outUrl, setOutUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Patch 043: revoke the input preview URL and the resized output URL
  // when replaced or on unmount (both leaked before).
  useEffect(() => () => { if (img?.url) URL.revokeObjectURL(img.url); }, [img?.url]);
  useEffect(() => () => { if (outUrl) URL.revokeObjectURL(outUrl); }, [outUrl]);
  const canvasRef = useRef(null);
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("File is over the 20 MB limit."); return; }
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setError("Please choose a JPG, PNG or WebP image."); return; }
    setError("");
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => { setImg({ url, image, w: image.width, h: image.height }); setWidth(String(Math.min(1200, image.width))); setHeight(String(Math.round(Math.min(1200, image.width) * image.height / image.width))); setOutUrl(""); };
    image.onerror = () => { URL.revokeObjectURL(url); setError("That image could not be read."); };
    image.src = url;
  };
  const onWidth = (v) => {
    setWidth(v);
    if (lock && img && Number(v) > 0) setHeight(String(Math.round((Number(v) * img.h) / img.w)));
  };
  const onHeight = (v) => {
    setHeight(v);
    if (lock && img && Number(v) > 0) setWidth(String(Math.round((Number(v) * img.w) / img.h)));
  };
  const resize = async () => {
    if (!img) { setError("Upload an image first."); return; }
    const w = Number(width), h = Number(height);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w < 1 || h < 1 || w > 8000 || h > 8000) { setError("Enter a width and height between 1 and 8000 px."); return; }
    setBusy(true); setError("");
    try {
      const pica = (await import("pica")).default;
      const src = document.createElement("canvas");
      src.width = img.w; src.height = img.h;
      src.getContext("2d").drawImage(img.image, 0, 0);
      const dst = document.createElement("canvas");
      dst.width = w; dst.height = h;
      const ctx = dst.getContext("2d");
      if (mode === "fit") {
        const s = Math.min(w / img.w, h / img.h);
        const dw = Math.round(img.w * s), dh = Math.round(img.h * s);
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);
        const tmp = document.createElement("canvas"); tmp.width = dw; tmp.height = dh;
        await pica().resize(src, tmp);
        ctx.drawImage(tmp, Math.round((w - dw) / 2), Math.round((h - dh) / 2));
      } else if (mode === "crop") {
        const s = Math.max(w / img.w, h / img.h);
        const sw = Math.round(w / s), sh = Math.round(h / s);
        const sx = Math.round((img.w - sw) / 2), sy = Math.round((img.h - sh) / 2);
        const tmp = document.createElement("canvas"); tmp.width = sw; tmp.height = sh;
        tmp.getContext("2d").drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
        await pica().resize(tmp, dst);
      } else {
        await pica().resize(src, dst);
      }
      canvasRef.current = dst;
      dst.toBlob((b) => { if (b) setOutUrl(URL.createObjectURL(b)); }, format === "png" ? "image/png" : "image/jpeg", 0.92);
    } catch (err) {
      setError("Resize failed in this browser. (" + (err?.message || "unknown error") + ")");
    } finally { setBusy(false); }
  };
  const download = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((b) => { if (b) downloadBlob(`resized-${width}x${height}.${format === "png" ? "png" : "jpg"}`, b); }, format === "png" ? "image/png" : "image/jpeg", 0.92);
  };
  return (
    <div>
      <p className="notice info">Local only — high-quality resize with Pica, loaded on demand. Nothing is uploaded.</p>
      <label htmlFor="ir-file">Upload an image (JPG, PNG or WebP, up to 20 MB)</label>
      <input id="ir-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} />
      {img && <p>Original size: {img.w} × {img.h} px</p>}
      <label htmlFor="ir-w">Target width (px)</label>
      <input id="ir-w" className="input" type="number" min="1" max="8000" value={width} onChange={(e) => onWidth(e.target.value)} />
      <label htmlFor="ir-h">Target height (px)</label>
      <input id="ir-h" className="input" type="number" min="1" max="8000" value={height} onChange={(e) => onHeight(e.target.value)} />
      <p><label><input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> Maintain aspect ratio</label></p>
      <label htmlFor="ir-mode">Mode</label>
      <select id="ir-mode" className="input" value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="fit">Fit — whole image, padded to target size</option>
        <option value="crop">Crop — fill target size, trim edges</option>
        <option value="stretch">Stretch — exact size (may distort)</option>
      </select>
      <label htmlFor="ir-fmt">Output format</label>
      <select id="ir-fmt" className="input" value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="jpeg">JPG</option><option value="png">PNG</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" disabled={busy} onClick={resize}>{busy ? "Resizing…" : "Resize Image"}</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {outUrl && <div><p><img className="preview" src={outUrl} alt="Resized image preview" /></p><div className="toolbar"><button type="button" className="btn" onClick={download}>Download Resized Image</button></div></div>}
    </div>
  );
}
