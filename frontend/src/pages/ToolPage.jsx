import { lazy, Suspense, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTool } from "../config/tools.js";
import ToolPageLayout from "../components/ToolPageLayout.jsx";
import { trackEvent } from "../services/analytics.js";

const MAP = {
  "youtube-title-generator": lazy(() => import("../tools/youtube/YoutubeTitleGenerator.jsx")),
  "youtube-description-generator": lazy(() => import("../tools/youtube/YoutubeDescriptionGenerator.jsx")),
  "youtube-hashtag-generator": lazy(() => import("../tools/youtube/YoutubeHashtagGenerator.jsx")),
  "youtube-tag-generator": lazy(() => import("../tools/youtube/YoutubeTagGenerator.jsx")),
  "youtube-thumbnail-resizer": lazy(() => import("../tools/youtube/YoutubeThumbnailResizer.jsx")),
  "video-aspect-ratio-calculator": lazy(() => import("../tools/youtube/VideoAspectRatioCalculator.jsx")),
  "youtube-earnings-calculator": lazy(() => import("../tools/youtube/YoutubeEarningsCalculator.jsx")),
  "youtube-shorts-title-generator": lazy(() => import("../tools/youtube/YoutubeShortsTitleGenerator.jsx")),
  "instagram-caption-generator": lazy(() => import("../tools/instagram/InstagramCaptionGenerator.jsx")),
  "instagram-hashtag-generator": lazy(() => import("../tools/instagram/InstagramHashtagGenerator.jsx")),
  "instagram-bio-generator": lazy(() => import("../tools/instagram/InstagramBioGenerator.jsx")),
  "instagram-post-size-calculator": lazy(() => import("../tools/instagram/InstagramPostSizeCalculator.jsx")),
  "instagram-engagement-calculator": lazy(() => import("../tools/instagram/InstagramEngagementCalculator.jsx")),
  "tiktok-hook-generator": lazy(() => import("../tools/tiktok/TiktokHookGenerator.jsx")),
  "tiktok-caption-generator": lazy(() => import("../tools/tiktok/TiktokCaptionGenerator.jsx")),
  "tiktok-hashtag-generator": lazy(() => import("../tools/tiktok/TiktokHashtagGenerator.jsx")),
  "image-compressor": lazy(() => import("../tools/image/ImageCompressor.jsx")),
  "image-resizer": lazy(() => import("../tools/image/ImageResizer.jsx")),
  "jpg-to-png-converter": lazy(() => import("../tools/image/JpgToPngConverter.jsx")),
  "word-counter": lazy(() => import("../tools/text/WordCounter.jsx")),
  "text-case-converter": lazy(() => import("../tools/text/TextCaseConverter.jsx"))
};

export default function ToolPage() {
  const { slug } = useParams();
  const tool = getTool(slug);
  // tool_open: only the tool slug is sent — never the user's input.
  useEffect(() => {
    if (tool) trackEvent("tool_open", { tool: tool.slug });
  }, [tool?.slug]);
  if (!tool) {
    return (
      <div className="container section">
        <h1>Tool not found</h1>
        <p>There is no tool at this address. <Link to="/tools">Browse all 21 tools</Link>.</p>
      </div>
    );
  }
  const Tool = MAP[slug];
  return (
    <ToolPageLayout tool={tool}>
      <Suspense fallback={<p>Loading tool…</p>}>
        <Tool />
      </Suspense>
    </ToolPageLayout>
  );
}
