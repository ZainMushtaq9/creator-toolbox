import { useState, useEffect } from "react";
import { downloadBlob } from "../../utils/format.js";

export default function JpgToPngConverter() {
  const [img, setImg] = useState(null);
  const [out, setOut] = useState(null);
  const [error, setError] = useState("");
  // Patch 043: revoke the input preview URL and the converted output URL
  // when replaced or on unmount (both leaked before).
  useEffect(() => () => { if (img?.url) URL.revokeObjectURL(img.url); }, [img?.url]);
  useEffect(() => () => { if (out?.url) URL.revokeObjectURL(out.url); }, [out?.url]);
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("File is over the 20 MB limit."); return; }
    if (!/^image\/jpeg$/.test(f.type) && !/\.jpe?g$/i.test(f.name)) { setError("Please choose a JPG/JPEG image."); return; }
    setError("");
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => { setImg({ url, image, name: f.name }); setOut(null); };
    image.onerror = () => { URL.revokeObjectURL(url); setError("That image could not be read."); };
    image.src = url;
  };
  const convert = () => {
    if (!img) { setError("Upload a JPG image first."); return; }
    const canvas = document.createElement("canvas");
    canvas.width = img.image.width; canvas.height = img.image.height;
    canvas.getContext("2d").drawImage(img.image, 0, 0);
    canvas.toBlob((b) => { if (b) setOut({ blob: b, url: URL.createObjectURL(b) }); }, "image/png");
  };
  const download = () => {
    if (out?.blob) downloadBlob(img.name.replace(/\.[^.]+$/, "") + ".png", out.blob);
  };
  return (
    <div>
      <p className="notice info">Local only — conversion uses the Canvas API in your browser. Nothing is uploaded. Converting JPG to PNG does not restore quality lost in JPG compression, and PNG files are usually larger.</p>
      <label htmlFor="jp-file">Upload a JPG image (up to 20 MB)</label>
      <input id="jp-file" type="file" accept="image/jpeg,.jpg,.jpeg" onChange={onFile} />
      <div className="toolbar"><button type="button" className="btn" onClick={convert}>Convert to PNG</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {img && <p><img className="preview" src={img.url} alt="Original JPG preview" /></p>}
      {out && <div><p><img className="preview" src={out.url} alt="Converted PNG preview" /></p><div className="toolbar"><button type="button" className="btn" onClick={download}>Download PNG</button></div></div>}
    </div>
  );
}
