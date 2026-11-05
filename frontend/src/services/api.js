// Frontend API client for the Cloudflare Worker (Deliverable B).
// Deliverable A tools run locally and do not call this client.
const BASE = import.meta.env.VITE_API_URL || "";
export async function apiGet(path) {
  if (!BASE) throw new Error("API not configured (VITE_API_URL is empty).");
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
export async function getHealth() { return apiGet("/api/v1/health"); }
export async function getToolsConfig() { return apiGet("/api/v1/tools/config"); }
