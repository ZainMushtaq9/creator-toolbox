import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Moon, Sun, Wrench } from "lucide-react";
import { CATEGORIES } from "../config/tools.js";

function getInitialTheme() {
  try {
    const saved = localStorage.getItem("ct-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("ct-theme", theme); } catch { /* storage unavailable */ }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return (
    <header className="site-header">
      <div className="container">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <Wrench size={20} style={{ verticalAlign: "-3px", marginRight: 6 }} />
          Creator<span>Toolbox</span>
        </Link>
        <button type="button" className="nav-toggle" aria-label="Toggle navigation" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
          <Menu size={20} /> Menu
        </button>
        <button
          className="theme-toggle"
          type="button"
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <nav id="main-nav" className={`nav${open ? " open" : ""}`} aria-label="Main navigation">
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/tools" onClick={() => setOpen(false)}>All Tools</NavLink>
          {CATEGORIES.map((c) => (
            <NavLink key={c.slug} to={c.path} onClick={() => setOpen(false)}>{c.name.replace(" Tools", "")}</NavLink>
          ))}
          <NavLink to="/workflows" onClick={() => setOpen(false)}>Workflows</NavLink>
          <NavLink to="/collections" onClick={() => setOpen(false)}>Collections</NavLink>
          <NavLink to="/workspaces" onClick={() => setOpen(false)}>Workspaces</NavLink>
          <NavLink to="/blog" onClick={() => setOpen(false)}>Blog</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
