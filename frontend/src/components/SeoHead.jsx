import { Helmet } from "react-helmet-async";
import { pageMeta } from "../config/seo.js";

// Unique title / description / canonical / OG per page, plus optional JSON-LD.
// No fake reviews, ratings or prices are ever added to structured data.
export default function SeoHead({ title, description, path, jsonLd }) {
  const meta = pageMeta({ title, description, path });
  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />
      <meta name="robots" content="index,follow" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:site_name" content="CreatorToolbox" />
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  );
}
