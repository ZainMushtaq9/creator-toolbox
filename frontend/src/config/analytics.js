// GA4 is CONFIG-GATED and OFF by default.
// Set enabled: true and a real measurement ID (G-XXXXXXX) only when ready.
// No tracking script is loaded while enabled is false.
export const ANALYTICS_CONFIG = {
  enabled: false,
  measurementId: "G-XXXXXXXXXX" // replace with your real GA4 ID
};
export const GA4_EVENTS = ["page_view","tool_open","tool_start","tool_complete","tool_error","file_download","copy_result","search","category_select"];
// Analytics events must never include private text, file contents or emails.
