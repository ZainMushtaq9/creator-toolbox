import { Link } from "react-router-dom";
import { toolsByCategory } from "../config/tools.js";
export default function CategoryCard({ category }) {
  const tools = toolsByCategory(category.slug);
  return (
    <article className="card">
      <h3><Link to={category.path}>{category.name}</Link></h3>
      <p>{category.description}</p>
      <p><strong>{tools.length} tools</strong></p>
    </article>
  );
}
