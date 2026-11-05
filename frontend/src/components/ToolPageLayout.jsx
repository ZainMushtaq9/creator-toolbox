import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "./Breadcrumb.jsx";
import SeoHead from "./SeoHead.jsx";
import AdSlot from "./AdSlot.jsx";
import { getCategory, relatedTools } from "../config/tools.js";
import { webAppJsonLd, breadcrumbJsonLd, faqJsonLd } from "../config/seo.js";
import { trackEvent } from "../services/analytics.js";

// Delegated analytics for the tool interaction area (config-gated OFF by
// default; trackEvent no-ops while disabled). Only the tool slug and the
// action type are sent — never the user's input, file contents or results.
//   - tool_start: first form submit or generate-type button click.
//   - tool_complete: a result (.output / .result-list) appears after a start.
//   - copy_result / file_download: a Copy / Download button click.
const START_BUTTON = /generate|calculate|convert|compress|resize|count|check/i;

export default function ToolPageLayout({ tool, children }) {
  const cat = getCategory(tool.category);
  const related = relatedTools(tool);
  const boxRef = useRef(null);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  useEffect(() => {
    startedRef.current = false;
    completedRef.current = false;
    const box = boxRef.current;
    if (!box) return undefined;
    const onSubmit = () => {
      if (!startedRef.current) { startedRef.current = true; completedRef.current = false; trackEvent("tool_start", { tool: tool.slug }); }
    };
    const onClick = (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const label = btn.textContent || "";
      if (!startedRef.current && START_BUTTON.test(label)) {
        startedRef.current = true;
        completedRef.current = false;
        trackEvent("tool_start", { tool: tool.slug });
      }
      if (/copy/i.test(label)) trackEvent("copy_result", { tool: tool.slug });
      else if (/download/i.test(label)) trackEvent("file_download", { tool: tool.slug });
    };
    // tool_complete fires when a result element appears after a start.
    const observer = new MutationObserver(() => {
      if (!startedRef.current || completedRef.current) return;
      if (box.querySelector(".output, .result-list")) {
        completedRef.current = true;
        trackEvent("tool_complete", { tool: tool.slug });
      }
    });
    observer.observe(box, { childList: true, subtree: true });
    box.addEventListener("submit", onSubmit);
    box.addEventListener("click", onClick);
    return () => { observer.disconnect(); box.removeEventListener("submit", onSubmit); box.removeEventListener("click", onClick); };
  }, [tool.slug]);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "All Tools", path: "/tools" },
    { name: cat.name, path: cat.path },
    { name: tool.name, path: null }
  ];
  const jsonLd = [webAppJsonLd(tool), breadcrumbJsonLd(crumbs.filter((c) => c.path)), faqJsonLd(tool.faqs)];
  return (
    <div className="container">
      <SeoHead title={tool.title} description={tool.description} path={`/tools/${tool.slug}`} jsonLd={jsonLd} />
      <Breadcrumb items={crumbs} />
      <h1>{tool.name}</h1>
      <p className="lede" style={{ color: "var(--muted)", maxWidth: 720 }}>{tool.description}</p>
      <p style={{ fontSize: ".9rem", opacity: .8 }}>By CreatorToolbox · Updated November 2026</p>
      <div className="tool-layout">
        <div className="tool-box" ref={boxRef}>{children}</div>
        {/* Ad slot is deliberately BELOW the tool interaction. */}
        <AdSlot slot="toolBelow" />
        <section aria-labelledby="how-to">
          <h2 id="how-to">How to use the {tool.name}</h2>
          <ol>{tool.howTo.map((s, i) => (<li key={i}>{s}</li>))}</ol>
          <h2>Supported formats and limitations</h2>
          <p>{tool.formats}</p>
          <h2>Example use cases</h2>
          <ul>{tool.examples.map((s, i) => (<li key={i}>{s}</li>))}</ul>
        </section>
        <section aria-labelledby="tool-facts">
          <h2 id="tool-facts">Tool facts</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr><th style={{ textAlign: "left", padding: "8px 8px 8px 0", verticalAlign: "top" }}>What it does</th><td style={{ padding: "8px 0" }}>{tool.description}</td></tr>
              <tr><th style={{ textAlign: "left", padding: "8px 8px 8px 0", verticalAlign: "top" }}>Cost</th><td style={{ padding: "8px 0" }}>Free — no subscription and no sign-up.</td></tr>
              <tr><th style={{ textAlign: "left", padding: "8px 8px 8px 0", verticalAlign: "top" }}>Privacy</th><td style={{ padding: "8px 0" }}>Runs in your browser — nothing is uploaded to a server.</td></tr>
              <tr><th style={{ textAlign: "left", padding: "8px 8px 8px 0", verticalAlign: "top" }}>Formats and limits</th><td style={{ padding: "8px 0" }}>{tool.formats}</td></tr>
            </tbody>
          </table>
        </section>
        <section className="faq" aria-labelledby="faqs">
          <h2 id="faqs">Frequently asked questions</h2>
          {tool.faqs.map((f, i) => (
            <details key={i}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </section>
        <section aria-labelledby="related">
          <h2 id="related">Related tools</h2>
          <div className="grid">
            {related.map((t) => (
              <article className="card" key={t.slug}>
                <h3><Link to={`/tools/${t.slug}`}>{t.name}</Link></h3>
                <p>{t.description}</p>
              </article>
            ))}
          </div>
          <p style={{ marginTop: 16 }}><Link to={cat.path}>← Back to {cat.name}</Link> · <Link to="/tools">All tools</Link></p>
        </section>
      </div>
    </div>
  );
}
