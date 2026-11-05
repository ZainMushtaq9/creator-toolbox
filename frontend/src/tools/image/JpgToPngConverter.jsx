import { useState } from "react";
import { downloadBlob } from "../../utils/format.js";

export default function JpgToPngConverter() {
  const [img, setImg] = useState(null);
  const [outUrl, setOutUrl] = useState("");
  const [error, setError] = useState("");
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("File is over the 20 MB limit."); return; }
    if (!/^image\/jpeg$/.test(f.type) && !/\.jpe?g$/i.test(f.name)) { setError("Please choose a JPG/JPEG image."); return; }
    setError("");
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => { setImg({ url, image, name: f.name }); setOutUrl(""); };
    image.onerror = () => setError("That image could not be read.");
    image.src = url;
  };
  const convert = () => {
    if (!img) { setError("Upload a JPG image first."); return; }
    const canvas = document.createElement("canvas");
    canvas.width = img.image.width; canvas.height = img.image.height;
    canvas.getContext("2d").drawImage(img.image, 0, 0);
    setOutUrl(canvas.toDataURL("image/png"));
  };
  const download = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.image.width; canvas.height = img.image.height;
    canvas.getContext("2d").drawImage(img.image, 0, 0);
    canvas.toBlob((b) => { if (b) downloadBlob(img.name.replace(/\.[^.]+$/, "") + ".png", b); }, "image/png");
  };
  return (
    <div>
      <p className="notice info">Local only — conversion uses the Canvas API in your browser. Nothing is uploaded. Converting JPG to PNG does not restore quality lost in JPG compression, and PNG files are usually larger.</p>
      <label htmlFor="jp-file">Upload a JPG image (up to 20 MB)</label>
      <input id="jp-file" type="file" accept="image/jpeg,.jpg,.jpeg" onChange={onFile} />
      <div className="toolbar"><button type="button" className="btn" onClick={convert}>Convert to PNG</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {img && <p><img className="preview" src={img.url} alt="Original JPG preview" /></p>}
      {outUrl && <div><p><img className="preview" src={outUrl} alt="Converted PNG preview" /></p><div className="toolbar"><button type="button" className="btn" onClick={download}>Download PNG</button></div></div>}
    </div>
  );
}
