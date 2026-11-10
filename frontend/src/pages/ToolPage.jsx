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
  "text-case-converter": lazy(() => import("../tools/text/TextCaseConverter.jsx")),
  "percentage-calculator": lazy(() => import("../tools/calculator/PercentageCalculator.jsx")),
  "age-calculator": lazy(() => import("../tools/calculator/AgeCalculator.jsx")),
  "bmi-calculator": lazy(() => import("../tools/calculator/BmiCalculator.jsx")),
  "loan-emi-calculator": lazy(() => import("../tools/calculator/LoanEmiCalculator.jsx")),
  "unit-converter": lazy(() => import("../tools/calculator/UnitConverter.jsx")),
  "compound-interest-calculator": lazy(() => import("../tools/calculator/CompoundInterestCalculator.jsx")),
  "calorie-calculator": lazy(() => import("../tools/calculator/CalorieCalculator.jsx")),
  "cgpa-calculator": lazy(() => import("../tools/calculator/CgpaCalculator.jsx")),
  "zakat-calculator": lazy(() => import("../tools/calculator/ZakatCalculator.jsx")),
  "gold-value-calculator": lazy(() => import("../tools/calculator/GoldValueCalculator.jsx")),
  "pakistan-salary-tax-calculator": lazy(() => import("../tools/calculator/PakistanSalaryTaxCalculator.jsx")),
  "pakistan-electricity-bill-calculator": lazy(() => import("../tools/calculator/PakistanElectricityBillCalculator.jsx")),
  "mortgage-calculator": lazy(() => import("../tools/calculator/MortgageCalculator.jsx")),
  "salary-to-hourly-calculator": lazy(() => import("../tools/calculator/SalaryToHourlyCalculator.jsx")),
  "discount-calculator": lazy(() => import("../tools/calculator/DiscountCalculator.jsx")),
  "sip-calculator": lazy(() => import("../tools/calculator/SipCalculator.jsx")),
  "pregnancy-due-date-calculator": lazy(() => import("../tools/calculator/PregnancyCalculator.jsx")),
  "time-zone-converter": lazy(() => import("../tools/calculator/TimeZoneConverter.jsx")),
  "daily-water-intake-calculator": lazy(() => import("../tools/calculator/WaterIntakeCalculator.jsx")),
  "fuel-cost-calculator": lazy(() => import("../tools/calculator/FuelCostCalculator.jsx"))
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
        <p>There is no tool at this address. <Link to="/tools">Browse all 41 tools</Link>.</p>
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
