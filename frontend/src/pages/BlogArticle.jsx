import { Link, useParams } from "react-router-dom";
import SeoHead from "../components/SeoHead.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { getArticle } from "../config/blog.js";
import { getTool } from "../config/tools.js";

export default function BlogArticle() {
  const { slug } = useParams();
  const article = getArticle(slug);
  if (!article) return <div className="container section"><h1>Article not found</h1><p><Link to="/blog">Back to the blog</Link>.</p></div>;
  const tool = getTool(article.tool);
  return (
    <div className="container section">
      <SeoHead title={article.title} description={article.description} path={`/blog/${article.slug}`} />
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: article.title, path: null }]} />
      <article style={{ maxWidth: 760 }}>
        <h1>{article.title}</h1>
        <p><time dateTime={article.date}>{article.date}</time> · CreatorToolbox</p>
        {article.body.map((p, i) => <p key={i}>{p}</p>)}
        {tool && <p className="notice info">Try it: <Link to={`/tools/${tool.slug}`}>{tool.name}</Link> — free, in your browser.</p>}
        <p><Link to="/blog">← All articles</Link></p>
      </article>
    </div>
  );
}
