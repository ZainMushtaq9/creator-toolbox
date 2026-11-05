// SEO API client — Worker-backed when configured, deterministic local
// engine otherwise. The Worker is used ONLY when VITE_API_URL is set AND
// an owner token is present in sessionStorage. Otherwise every module runs
// its local service in the browser and the result is labelled source
// "local". Private page text is never sent to the Worker unless the user
// explicitly runs a Worker-backed action (i.e. the Worker is configured
// and unlocked and the user submits the form).
import { getToken } from "./auth.js";

export function apiBase() {
  return (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
}

export function isWorkerConfigured() {
  return Boolean(apiBase());
}

// "worker" only when an API URL is configured AND a token is present;
// otherwise "local". The dashboard shows this honestly.
export function apiMode() {
  return isWorkerConfigured() && getToken() ? "worker" : "local";
}

export async function seoFetch(path, { method = "GET", body } = {}) {
  const base = apiBase();
  if (!base) throw new Error("API not configured (VITE_API_URL is empty). Running in local mode instead.");
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Worker returned an unreadable response (HTTP ${res.status}).`);
  }
  if (!res.ok || json?.success === false) {
    const msg = json?.error?.message || json?.error || `Worker error (HTTP ${res.status}).`;
    throw new Error(String(msg));
  }
  return json?.data ?? json;
}

// Run a Worker endpoint when configured+unlocked, otherwise run the local
// deterministic function in the browser. Returns { source, data } where
// source is "worker" or "local". A Worker failure is surfaced as an error —
// it is never silently relabelled as a local result.
export async function runSeo(path, body, localFn) {
  if (isWorkerConfigured() && getToken()) {
    const data = await seoFetch(path, { method: "POST", body });
    return { source: "worker", data };
  }
  return { source: "local", data: localFn(body) };
}

// ---- Local report storage (localStorage 'ct-seo-reports') ----
// Reports saved in local mode live in this browser only. They are never
// claimed to be stored server-side.
export const REPORTS_KEY = "ct-seo-reports";

export function loadLocalReports() {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalReport({ type, title, data }) {
  const reports = loadLocalReports();
  const report = {
    id: `local-${Date.now()}`,
    type,
    title: title || type,
    createdAt: new Date().toISOString(),
    source: "local",
    status: "pending approval",
    data,
  };
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify([report, ...reports]));
  } catch {
    throw new Error("Browser storage is unavailable — the report could not be saved locally.");
  }
  return report;
}

export function deleteLocalReport(id) {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(loadLocalReports().filter((r) => r.id !== id)));
  } catch {
    // Storage unavailable; nothing to delete.
  }
}
