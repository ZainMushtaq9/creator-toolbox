import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "../pages/Home.jsx";
// Patch 043: every non-home route is lazy-loaded so the homepage's initial
// JS no longer carries the code for all 14 other pages (index chunk
// 318,653 B -> ~268 kB raw). Home stays eager (it is the landing page).
// The single <Suspense> fallback below already covers lazy routes.
const AllTools = lazy(() => import("../pages/AllTools.jsx"));
const Category = lazy(() => import("../pages/Category.jsx"));
const ToolPage = lazy(() => import("../pages/ToolPage.jsx"));
const About = lazy(() => import("../pages/About.jsx"));
const Contact = lazy(() => import("../pages/Contact.jsx"));
const Blog = lazy(() => import("../pages/Blog.jsx"));
const BlogArticle = lazy(() => import("../pages/BlogArticle.jsx"));
const Legal = lazy(() => import("../pages/Legal.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));
const Workflows = lazy(() => import("../pages/Workflows.jsx"));
const YoutubeWorkflow = lazy(() => import("../pages/YoutubeWorkflow.jsx"));
const Workspaces = lazy(() => import("../pages/Workspaces.jsx"));
const Collections = lazy(() => import("../pages/Collections.jsx"));
const CollectionPage = lazy(() => import("../pages/CollectionPage.jsx"));
const SeoExperiments = lazy(() => import("../pages/SeoExperiments.jsx"));

const SeoDashboard = lazy(() => import("../seo/pages/SeoDashboard.jsx"));
const KeywordResearch = lazy(() => import("../seo/pages/KeywordResearch.jsx"));
const CompetitorAnalysis = lazy(() => import("../seo/pages/CompetitorAnalysis.jsx"));
const PageAudit = lazy(() => import("../seo/pages/PageAudit.jsx"));
const KeywordGap = lazy(() => import("../seo/pages/KeywordGap.jsx"));
const SearchConsole = lazy(() => import("../seo/pages/SearchConsole.jsx"));
const Aeo = lazy(() => import("../seo/pages/Aeo.jsx"));
const Gso = lazy(() => import("../seo/pages/Gso.jsx"));
const AiRecommendations = lazy(() => import("../seo/pages/AiRecommendations.jsx"));
const SeoReports = lazy(() => import("../seo/pages/Reports.jsx"));
const SeoSettings = lazy(() => import("../seo/pages/Settings.jsx"));

export default function Router() {
  return (
    <Suspense fallback={<div className="container section"><p>Loading…</p></div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<AllTools />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
        <Route path="/youtube-tools" element={<Category slug="youtube-tools" />} />
        <Route path="/instagram-tools" element={<Category slug="instagram-tools" />} />
        <Route path="/tiktok-tools" element={<Category slug="tiktok-tools" />} />
        <Route path="/image-tools" element={<Category slug="image-tools" />} />
        <Route path="/text-tools" element={<Category slug="text-tools" />} />
        <Route path="/calculator-tools" element={<Category slug="calculator-tools" />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/workflows/youtube-creator" element={<YoutubeWorkflow />} />
        <Route path="/workspaces" element={<Workspaces />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:slug" element={<CollectionPage />} />
        <Route path="/seo" element={<SeoDashboard />} />
        <Route path="/seo/keywords" element={<KeywordResearch />} />
        <Route path="/seo/competitor" element={<CompetitorAnalysis />} />
        <Route path="/seo/audit" element={<PageAudit />} />
        <Route path="/seo/gaps" element={<KeywordGap />} />
        <Route path="/seo/search-console" element={<SearchConsole />} />
        <Route path="/seo/aeo" element={<Aeo />} />
        <Route path="/seo/gso" element={<Gso />} />
        <Route path="/seo/ai" element={<AiRecommendations />} />
        <Route path="/seo/reports" element={<SeoReports />} />
        <Route path="/seo/settings" element={<SeoSettings />} />
        <Route path="/seo/experiments" element={<SeoExperiments />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<Legal page="privacy" />} />
        <Route path="/terms" element={<Legal page="terms" />} />
        <Route path="/disclaimer" element={<Legal page="disclaimer" />} />
        <Route path="/cookie-policy" element={<Legal page="cookie" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
