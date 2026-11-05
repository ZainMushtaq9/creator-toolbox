import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./app/App.jsx";
import "./styles/global.css";
import { ANALYTICS_CONFIG } from "./config/analytics.js";

// GA4 loader — runs ONLY when analytics is enabled AND a real measurement
// ID is configured. While enabled is false (the default), no Google
// script is loaded and no tracking happens.
if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.measurementId && !ANALYTICS_CONFIG.measurementId.includes("XXXXXXXX")) {
  const id = ANALYTICS_CONFIG.measurementId;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
