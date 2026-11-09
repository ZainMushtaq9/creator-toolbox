import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Router from "./router.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import { trackEvent } from "../services/analytics.js";

// Sends a page_view on every route change. Only the path is sent —
// never query strings, tool inputs or file contents.
function RouteTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackEvent("page_view", { page_path: pathname });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <RouteTracker />
      {/* Patch 043: skip link — keyboard users previously tabbed through
          13 nav links + 2 header buttons (15 stops) before any content. */}
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
