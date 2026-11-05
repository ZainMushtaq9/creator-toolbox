import { useState, useRef } from "react";
import { downloadBlob } from "../../utils/format.js";

export default function YoutubeThumbnailResizer() {
  const [img, setImg] = useState(null);
  const [mode, setMode] = useState("cover");
  const [format, setFormat] = useState("jpeg");
  const [outUrl, setOutUrl] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const canvasRef = useRef(null);
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("File is over the 20 MB limit. Choose a smaller image."); return; }
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setError("Please choose a JPG, PNG or WebP image."); return; }
    setError("");
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => { setImg({ url, image }); setOutUrl(""); };
    image.onerror = () => setError("That image could not be read. Try a different file.");
    image.src = url;
  };
  const resize = () => {
    if (!img) { setError("Upload an image first."); return; }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 1280; canvas.height = 720;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 1280, 720);
    const { image } = img;
    const sRatio = image.width / image.height, tRatio = 1280 / 720;
    let dw, dh, dx, dy;
    if (mode === "cover") {
      if (sRatio > tRatio) { dh = 720; dw = 720 * sRatio; dx = (1280 - dw) / 2; dy = 0; }
      else { dw = 1280; dh = 1280 / sRatio; dx = 0; dy = (720 - dh) / 2; }
    } else {
      if (sRatio > tRatio) { dw = 1280; dh = 1280 / sRatio; dx = 0; dy = (720 - dh) / 2; }
      else { dh = 720; dw = 720 * sRatio; dx = (1280 - dw) / 2; dy = 0; }
    }
    ctx.drawImage(image, dx, dy, dw, dh);
    const mime = format === "png" ? "image/png" : "image/jpeg";
    setOutUrl(canvas.toDataURL(mime, 0.92));
    setMsg("Resized to exactly 1280 × 720 pixels.");
  };
  const download = () => {
    canvasRef.current.toBlob((b) => { if (b) downloadBlob(`thumbnail-1280x720.${format === "png" ? "png" : "jpg"}`, b); }, format === "png" ? "image/png" : "image/jpeg", 0.92);
  };
  return (
    <div>
      <p className="notice info">Local only — your image is resized in your browser with the Canvas API and is never uploaded.</p>
      <label htmlFor="thumb-file">Upload an image (JPG, PNG or WebP, up to 20 MB)</label>
      <input id="thumb-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} />
      <label htmlFor="thumb-mode">Fit mode</label>
      <select id="thumb-mode" className="input" value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="cover">Cover — fill 1280 × 720, crop edges</option>
        <option value="contain">Contain — keep whole image, letterboxed</option>
      </select>
      <label htmlFor="thumb-fmt">Output format</label>
      <select id="thumb-fmt" className="input" value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="jpeg">JPG</option><option value="png">PNG</option>
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={resize}>Resize Thumbnail</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {msg && <p className="success">{msg}</p>}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {img && <p><img className="preview" src={img.url} alt="Original upload preview" /></p>}
      {outUrl && <div><p><img className="preview" src={outUrl} alt="Resized 1280 by 720 thumbnail preview" /></p><div className="toolbar"><button type="button" className="btn" onClick={download}>Download 1280 × 720</button></div></div>}
    </div>
  );
}
