// Admin authentication stub. Phase 4: verify ADMIN_TOKEN (Worker secret)
// with a constant-time comparison. Stage 1: no token is accepted.
export function isAdmin(request, env) {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || !env?.ADMIN_TOKEN) return false;
  if (token.length !== env.ADMIN_TOKEN.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ env.ADMIN_TOKEN.charCodeAt(i);
  return diff === 0;
}
