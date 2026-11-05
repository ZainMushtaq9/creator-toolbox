import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead.jsx";
import { WORKFLOWS } from "../config/workflows.js";
import { getTool } from "../config/tools.js";

export default function Workflows() {
  return (
    <div className="container section">
      <SeoHead title="Workflows — Connected Tool Sequences" description="Step-by-step workflows that carry one topic through several CreatorToolbox tools — YouTube, Instagram, blogging, development, study and small business." path="/workflows" />
      <h1>Workflows</h1>
      <p className="lede">Tools are useful. Connected tools are better. A workflow carries one topic through the steps of a real job instead of making you start over on every page.</p>
      <div className="grid">
        {WORKFLOWS.map((wf) => (
          <article className="card" key={wf.slug}>
            <h3>{wf.full ? <Link to={`/workflows/${wf.slug}`}>{wf.name}</Link> : wf.name}</h3>
            <p>{wf.description}</p>
            <p><strong>For:</strong> {wf.audience} · {wf.full ? "Full multi-step workflow" : "Guided tool sequence"}</p>
            {wf.full
              ? <p><Link to={`/workflows/${wf.slug}`}>Start the workflow →</Link></p>
              : <p>{(wf.tools || []).map((s) => { const t = getTool(s); return t ? <span key={s}><Link to={`/tools/${t.slug}`}>{t.name}</Link><br /></span> : null; })}</p>}
          </article>
        ))}
      </div>
      <p className="notice info">Only the YouTube workflow has full shared multi-step state in Stage 1. The others list their tools in order; full state for each arrives in later stages.</p>
    </div>
  );
}
