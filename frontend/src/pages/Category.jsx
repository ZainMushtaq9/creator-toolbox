import { Link } from "react-router-dom";
import { useEffect } from "react";
import SeoHead from "../components/SeoHead.jsx";
import ToolCard from "../components/ToolCard.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { getCategory, toolsByCategory } from "../config/tools.js";
import { trackEvent } from "../services/analytics.js";

export default function Category({ slug }) {
  const cat = getCategory(slug);
  // category_select: only the category slug is sent.
  useEffect(() => {
    if (cat) trackEvent("category_select", { category: cat.slug });
  }, [cat?.slug]);
  if (!cat) return <div className="container section"><h1>Category not found</h1><p><Link to="/tools">Browse all tools</Link>.</p></div>;
  const tools = toolsByCategory(slug);
  return (
    <div className="container section">
      <SeoHead title={cat.name} description={cat.description} path={cat.path} />
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "All Tools", path: "/tools" }, { name: cat.name, path: null }]} />
      <h1>{cat.name}</h1>
      <p className="lede">{cat.description}</p>
      <div className="grid">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      <p style={{ marginTop: 20 }}><Link to="/tools">← All tools</Link></p>
    </div>
  );
}
