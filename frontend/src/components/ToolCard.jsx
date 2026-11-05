import { Link } from "react-router-dom";
import { getCategory } from "../config/tools.js";
export default function ToolCard({ tool }) {
  const cat = getCategory(tool.category);
  return (
    <article className="card tool-card">
      <span className="category-badge">{cat ? cat.name : tool.category}</span>
      <h3><Link to={`/tools/${tool.slug}`}>{tool.name}</Link></h3>
      <p>{tool.description}</p>
    </article>
  );
}
