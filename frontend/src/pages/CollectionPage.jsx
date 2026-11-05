import { Link, useParams } from "react-router-dom";
import SeoHead from "../components/SeoHead.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import ToolCard from "../components/ToolCard.jsx";
import { getCollection } from "../config/collections.js";
import { getTool } from "../config/tools.js";

export default function CollectionPage() {
  const { slug } = useParams();
  const col = getCollection(slug);
  if (!col) return <div className="container section"><h1>Collection not found</h1><p><Link to="/collections">Browse all collections</Link>.</p></div>;
  const tools = col.tools.map(getTool).filter(Boolean);
  return (
    <div className="container section">
      <SeoHead title={`${col.name} — CreatorToolbox`} description={col.description} path={`/collections/${col.slug}`} />
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Collections", path: "/collections" }, { name: col.name, path: null }]} />
      <h1>{col.name}</h1>
      <p className="lede">{col.description}</p>
      <p><strong>For:</strong> {col.audience}</p>
      <h2>How to use this kit</h2>
      <ol>{col.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      <h2>Included tools</h2>
      <div className="grid">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      <p style={{ marginTop: 16 }}><Link to="/collections">← All collections</Link> · <Link to="/workflows">See workflows →</Link></p>
    </div>
  );
}
