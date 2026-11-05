import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead.jsx";
import { COLLECTIONS } from "../config/collections.js";

export default function Collections() {
  return (
    <div className="container section">
      <SeoHead title="Tool Collections — Curated Kits" description="Curated tool kits for one job: YouTube Starter, Instagram Growth, Blogger SEO, Website Launch, Developer Starter, Image Optimization, Student Productivity and Small Business." path="/collections" />
      <h1>Collections</h1>
      <p className="lede">Curated bundles of existing tools for one job — pick your kit and follow the steps.</p>
      <div className="grid">
        {COLLECTIONS.map((c) => (
          <article className="card" key={c.slug}>
            <h3><Link to={`/collections/${c.slug}`}>{c.name}</Link></h3>
            <p>{c.description}</p>
            <p><strong>For:</strong> {c.audience} · {c.tools.length} tools</p>
          </article>
        ))}
      </div>
    </div>
  );
}
