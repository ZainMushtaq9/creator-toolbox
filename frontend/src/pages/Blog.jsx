import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead.jsx";
import { ARTICLES } from "../config/blog.js";
import { getTool } from "../config/tools.js";

export default function Blog() {
  return (
    <div className="container section">
      <SeoHead title="Blog — Creator Guides" description="Practical guides for creators: image compression, YouTube titles and earnings, Instagram bios and engagement, image sizes and word counts." path="/blog" />
      <h1>Blog</h1>
      <p className="lede">Practical guides that support the tools — each article answers a real question with examples.</p>
      <div className="grid">
        {ARTICLES.map((a) => {
          const tool = getTool(a.tool);
          return (
            <article className="card" key={a.slug}>
              <h3><Link to={`/blog/${a.slug}`}>{a.title}</Link></h3>
              <p>{a.description}</p>
              <p>{tool && <><Link to={`/tools/${tool.slug}`}>Use the {tool.name} →</Link> · </>}<time dateTime={a.date}>{a.date}</time></p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
