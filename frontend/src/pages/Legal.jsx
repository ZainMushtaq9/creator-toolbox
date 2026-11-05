import SeoHead from "../components/SeoHead.jsx";

const PAGES = {
  privacy: {
    title: "Privacy Policy", path: "/privacy-policy",
    intro: "CreatorToolbox is designed to collect as little as possible. Most tools run entirely in your browser: your text and images are processed locally and are never uploaded to our servers.",
    sections: [
      ["What we collect", "We do not ask you to create an account. Tool inputs (text, images, numbers) stay in your browser unless a tool page explicitly says otherwise. The contact form opens your own email app; we receive only what you choose to send."],
      ["Local processing", "Image compression, resizing and conversion, text counting and conversion, and all template generators run locally in your browser. No files are uploaded for these tools."],
      ["AI processing (when enabled)", "AI features (SEO Intelligence) send only the page content you submit for analysis to the configured AI provider (Cloudflare Workers AI by default, running in our Cloudflare Worker; Google Gemini only as a long-context overflow, and Hugging Face / AnyRouter / Groq / NVIDIA only as optional fallbacks). AI is not used for the 21 launch tools — those use templates or calculations, and each tool page says so."],
      ["Analytics", "Google Analytics 4 is configured but disabled by default. If enabled, it collects anonymised usage statistics (pages visited, tool used) and never receives your tool inputs, file contents or email addresses."],
      ["Advertising", "Google AdSense is disabled until the site is approved. After approval, Google and its partners may use cookies to serve ads. See the Cookie Policy for details."],
      ["Search Console connection", "The owner's Search Console connection (a later stage) stores an encrypted refresh token in our database. It is never shared with visitors and is not used for advertising."],
      ["Your choices", "You can use every launch tool without signing up. Clearing your browser data removes any locally saved workspace data. Contact us at the address on the Contact page with privacy questions."]
    ]
  },
  terms: {
    title: "Terms of Use", path: "/terms",
    intro: "By using CreatorToolbox you agree to these terms. The tools are provided free of charge, as-is, without warranties.",
    sections: [
      ["Free core tools", "The core tools are free to use with no subscription required. Some features may have transparent limits (for example file-size limits), which are shown on each tool page. We do not claim the service is free of all limits forever."],
      ["Estimates and templates", "Calculators give estimates, not guarantees — YouTube earnings depend on RPM, audience and season. Template generators produce suggestions from templates, not AI, and you are responsible for checking output before publishing."],
      ["Acceptable use", "Do not use the tools to mislead, spam, infringe copyright, or break the law. Do not attempt to abuse rate limits or probe the backend."],
      ["No account needed", "No account or signup is required for the launch tools. If accounts are added later, separate terms will apply."],
      ["Liability", "We are not liable for decisions made from estimates, generated text, or resized images. Check important output before you rely on it."],
      ["Changes", "These terms may change; the current version is always published on this page."]
    ]
  },
  disclaimer: {
    title: "Disclaimer", path: "/disclaimer",
    intro: "CreatorToolbox tools are helpers, not professional advice.",
    sections: [
      ["Calculators are estimates", "The YouTube Earnings Calculator and Instagram Engagement Calculator use the formulas shown on their pages. Real earnings and engagement depend on factors no calculator can know."],
      ["Template generators are not AI", "Title, caption, bio, hook and hashtag generators use hand-written templates. They do not understand your content and may produce generic or unsuitable suggestions — review before using."],
      ["AI features (later stages)", "Where AI is used, its output can be wrong, outdated or incomplete. It never publishes changes automatically and should be checked against the source pages."],
      ["No professional advice", "Nothing on this site is financial, legal, medical or business advice."],
      ["Affiliate links", "This site currently contains no affiliate links and earns nothing from product links. If affiliate links are added later, they will be clearly labelled as affiliate links on the page where they appear, and the site may earn a commission if you buy through them, at no extra cost to you."],
      ["Third-party services", "Links to Google, Cloudflare, Hugging Face and other services are governed by those providers' terms."]
    ]
  },
  cookie: {
    title: "Cookie Policy", path: "/cookie-policy",
    intro: "This site uses as few cookies as possible.",
    sections: [
      ["Essential / local storage", "Your browser's local storage may hold workspace projects and SEO experiment notes you save yourself. This data stays on your device and is not sent to us."],
      ["Analytics cookies", "Google Analytics 4 (when enabled) uses cookies to count visits and understand which tools are popular. It is disabled by default in Stage 1."],
      ["Advertising cookies", "Google AdSense (after approval) uses cookies to serve and measure ads. You can manage advertising preferences in your Google account and browser settings."],
      ["Consent", "Where consent is required by local law, a consent banner and Google Consent Mode will be added before analytics or advertising cookies are set."],
      ["Managing cookies", "You can delete or block cookies in your browser settings. The tools will still work — they do not depend on cookies."]
    ]
  }
};

export default function Legal({ page }) {
  const p = PAGES[page] || PAGES.privacy;
  return (
    <div className="container section">
      <SeoHead title={p.title} description={p.intro} path={p.path} />
      <h1>{p.title}</h1>
      <p className="lede">{p.intro}</p>
      <div style={{ maxWidth: 760 }}>
        {p.sections.map(([h, body]) => (
          <section key={h}><h2>{h}</h2><p>{body}</p></section>
        ))}
        <p><em>Last updated: 2026-11-05. Replace the contact email and domain placeholders before launch.</em></p>
      </div>
    </div>
  );
}
