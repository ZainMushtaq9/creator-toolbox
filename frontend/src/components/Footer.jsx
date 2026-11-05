import { Link } from "react-router-dom";
import { CATEGORIES } from "../config/tools.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>CreatorToolbox</h3>
          <p>Free Tools. Smarter Creation. Free online tools for creators, developers, designers, students and marketers. Most tools run in your browser — no upload, no sign-up.</p>
        </div>
        <div>
          <h3>Categories</h3>
          <p>{CATEGORIES.map((c) => (<span key={c.slug}><Link to={c.path}>{c.name}</Link><br /></span>))}</p>
        </div>
        <div>
          <h3>Explore</h3>
          <p><Link to="/tools">All Tools</Link><br /><Link to="/blog">Blog</Link><br /><Link to="/about">About</Link><br /><Link to="/contact">Contact</Link></p>
        </div>
        <div>
          <h3>Legal</h3>
          <p><Link to="/privacy-policy">Privacy Policy</Link><br /><Link to="/terms">Terms</Link><br /><Link to="/disclaimer">Disclaimer</Link><br /><Link to="/cookie-policy">Cookie Policy</Link></p>
        </div>
      </div>
      <div className="container"><p style={{ marginTop: 24 }}>© 2026 CreatorToolbox. Free tools — calculators give estimates, template generators use templates, not AI.</p></div>
    </footer>
  );
}
