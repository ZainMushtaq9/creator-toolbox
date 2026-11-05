// Owner token helpers for the SEO Intelligence dashboard.
// The admin token lives in sessionStorage ONLY (key 'ct-admin-token') —
// it is cleared when the tab closes and is never written to localStorage,
// code, or logs. No secret is ever displayed back to the page.
const TOKEN_KEY = "ct-admin-token";

export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setToken(token) {
  try {
    sessionStorage.setItem(TOKEN_KEY, String(token || "").trim());
  } catch {
    // sessionStorage unavailable — dashboard stays locked.
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nothing to clear.
  }
}

export function isUnlocked() {
  return Boolean(getToken());
}
