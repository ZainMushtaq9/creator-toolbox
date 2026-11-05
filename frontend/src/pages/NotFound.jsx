import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead.jsx";
export default function NotFound() {
  return (
    <div className="container section">
      <SeoHead title="Page not found" description="This page does not exist on CreatorToolbox." path="/404" />
      <h1>Page not found</h1>
      <p>The page you asked for does not exist or has moved.</p>
      <p><Link to="/">Go to the homepage</Link> · <Link to="/tools">Browse all tools</Link></p>
    </div>
  );
}
