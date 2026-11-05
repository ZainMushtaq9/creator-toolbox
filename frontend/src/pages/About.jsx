import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead.jsx";

export default function About() {
  return (
    <div className="container section">
      <SeoHead title="About CreatorToolbox" description="CreatorToolbox is a free all-in-one tools platform for content creators and website owners — connected workflows, privacy-first processing, honest AI." path="/about" />
      <h1>About CreatorToolbox</h1>
      <p className="lede">CreatorToolbox is a free, all-in-one tools platform for content creators and website owners. The idea is simple: the small jobs that slow creators down — a title, a caption, a resized image, a word count — should take seconds, not a new app install or a subscription.</p>
      <h2>Who it is for</h2>
      <p>Content creators first — YouTubers, Instagram and TikTok creators — and website owners second: bloggers, small businesses, students and developers who need reliable utilities without friction.</p>
      <h2>What makes it different</h2>
      <p>Most tools sites are a pile of disconnected pages. CreatorToolbox connects them: <Link to="/workflows/youtube-creator">workflows</Link> carry one topic through several tools, <Link to="/workspaces">workspaces</Link> save results into projects on your device, and <Link to="/collections">collections</Link> bundle the tools for one job. And most tools process your work locally, in your browser — nothing is uploaded.</p>
      <h2>Our five principles</h2>
      <ol>
        <li><strong>Free core tools, no subscription required</strong> — with transparent limitations shown on each tool page. We do not claim the service is free of all limits forever.</li>
        <li><strong>Privacy-first local processing</strong> — text and image tools run in your browser; files are not uploaded.</li>
        <li><strong>No unnecessary signup</strong> — use the tools immediately; workspaces are local, not accounts.</li>
        <li><strong>Workflow-oriented</strong> — tools link to each other and to the next step of a real job.</li>
        <li><strong>Honest AI</strong> — every generator is labelled template, calculation or AI. Stage-1 generators use templates, not AI.</li>
      </ol>
      <h2>What is coming later</h2>
      <p>Stage 2 adds more image and developer tools, SEO Intelligence (the owner-only advanced product), Search Console integration and AEO/GSO analysis. Stage 3 grows the catalogue towards 50–100 quality tools, with more workflows, project export and experiments. Growth is funded first by advertising (AdSense), then by affiliates and digital products — never by paywalling the core tools. See <Link to="/blog">the blog</Link> and the <Link to="/tools">tool directory</Link> for what exists today.</p>
      <p><Link to="/contact">Contact us</Link> · <Link to="/privacy-policy">Privacy Policy</Link> · <Link to="/terms">Terms</Link></p>
    </div>
  );
}
