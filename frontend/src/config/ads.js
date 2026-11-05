// AdSense is CONFIG-GATED and OFF by default.
// Set enabled: true and a real publisher/slot ID only after AdSense approval.
// No ad script is loaded while enabled is false. Never invent a publisher ID.
export const ADS_CONFIG = {
  enabled: false,
  publisherId: "pub-YOUR-PUBLISHER-ID", // replace from your AdSense account
  slots: { toolBelow: "", inContent: "" }
};
