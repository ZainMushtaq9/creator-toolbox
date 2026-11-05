import { ADS_CONFIG } from "../config/ads.js";
// AdSense placeholder. Ads are served ONLY after approval and only when
// ADS_CONFIG.enabled is true with a real publisher/slot ID.
// This slot is rendered BELOW the main tool interaction, never above it,
// and never styled to look like a tool button.
export default function AdSlot({ slot = "toolBelow" }) {
  if (!ADS_CONFIG.enabled) {
    return (
      <div className="ad-slot" role="note" aria-label="Advertisement placeholder">
        Advertisement — AdSense placeholder. Ads appear here only after approval.
      </div>
    );
  }
  return (
    <div className="ad-slot" data-ad-slot={ADS_CONFIG.slots[slot] || slot}>
      <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={ADS_CONFIG.publisherId} data-ad-slot={ADS_CONFIG.slots[slot]} data-ad-format="auto" data-full-width-responsive="true" />
    </div>
  );
}
