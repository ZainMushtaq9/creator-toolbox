import { useState } from "react";
import SeoHead from "../components/SeoHead.jsx";
import { CONTACT_EMAIL } from "../config/site.js";

export default function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  // No backend form endpoint in Stage 1: the form composes a mailto draft
  // in the visitor's own email client. Nothing is stored by this site.
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("CreatorToolbox contact from " + name.trim())}&body=${encodeURIComponent(message)}`;
    setSent(true);
  };
  return (
    <div className="container section">
      <SeoHead title="Contact CreatorToolbox" description="Contact the CreatorToolbox publisher with feedback, corrections or tool requests." path="/contact" />
      <h1>Contact</h1>
      <p>Questions, corrections or a tool request? Send a message — it opens in your own email app. Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> (replace with the real address before launch).</p>
      <form onSubmit={submit} style={{ maxWidth: 560 }}>
        <label htmlFor="c-name">Your name</label>
        <input id="c-name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        <label htmlFor="c-msg">Message</label>
        <textarea id="c-msg" className="input" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required />
        <div className="toolbar"><button type="submit" className="btn">Send via Email</button></div>
        {sent && <p className="success">Your email app should have opened with the message ready to send.</p>}
      </form>
    </div>
  );
}
