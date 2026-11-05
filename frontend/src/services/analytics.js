import { ANALYTICS_CONFIG } from "../config/analytics.js";
// No-op while analytics is disabled. Never send private text or file contents.
export function trackEvent(name, params = {}) {
  if (!ANALYTICS_CONFIG.enabled) return;
  if (typeof window !== "undefined" && window.gtag) window.gtag("event", name, params);
}
