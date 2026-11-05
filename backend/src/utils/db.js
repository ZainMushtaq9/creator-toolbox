// D1 helpers. All queries use prepared statements (no string-built SQL).
// When env.DB is not bound (local dev / no D1 created yet) every helper
// returns { stored: false, reason: "no_db" } instead of failing — the API
// still answers, and nothing is silently pretended to be stored.
import { nanoid } from "nanoid";

export function hasDb(env) {
  return Boolean(env?.DB);
}

export function newId() {
  return nanoid(16);
}

function isoNow() {
  return new Date().toISOString();
}

// page_audits, keywords, ai_jobs and reports reference projects(id).
// Create the project row on first use so inserts never fail on the FK.
async function ensureProject(env, projectId) {
  await env.DB.prepare(
    "INSERT OR IGNORE INTO projects (id, name, website_url, created_at) VALUES (?, ?, ?, ?)"
  ).bind(projectId, projectId, "", isoNow()).run();
}

export async function insertReport(env, { projectId = "default", type, reportData }) {
  if (!hasDb(env)) return { stored: false, reason: "no_db" };
  await ensureProject(env, projectId);
  const id = newId();
  await env.DB.prepare(
    "INSERT INTO reports (id, project_id, type, report_data, created_at) VALUES (?, ?, ?, ?, ?)"
  ).bind(id, projectId, type, JSON.stringify(reportData), isoNow()).run();
  return { stored: true, id };
}

export async function listReports(env, projectId = "default", limit = 20) {
  if (!hasDb(env)) return { stored: false, reason: "no_db", reports: [] };
  const res = await env.DB.prepare(
    "SELECT id, project_id, type, created_at FROM reports WHERE project_id = ? ORDER BY created_at DESC LIMIT ?"
  ).bind(projectId, Math.min(Math.max(limit, 1), 50)).all();
  return { stored: true, reports: res.results || [] };
}

export async function getReport(env, id) {
  if (!hasDb(env)) return { stored: false, reason: "no_db", report: null };
  const row = await env.DB.prepare(
    "SELECT id, project_id, type, report_data, created_at FROM reports WHERE id = ?"
  ).bind(id).first();
  return { stored: true, report: row || null };
}

export async function deleteReport(env, id) {
  if (!hasDb(env)) return { stored: false, reason: "no_db", deleted: false };
  const res = await env.DB.prepare("DELETE FROM reports WHERE id = ?").bind(id).run();
  return { stored: true, deleted: Boolean(res?.meta?.changes) };
}

export async function saveAudit(env, { projectId = "default", url, score, auditData }) {
  if (!hasDb(env)) return { stored: false, reason: "no_db" };
  await ensureProject(env, projectId);
  const id = newId();
  await env.DB.prepare(
    "INSERT INTO page_audits (id, project_id, url, score, audit_data, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(id, projectId, url, score, JSON.stringify(auditData), isoNow()).run();
  return { stored: true, id };
}

export async function saveKeywords(env, { projectId = "default", keyword, country = "US", language = "en", intent = null, suggestions = [] }) {
  if (!hasDb(env)) return { stored: false, reason: "no_db" };
  await ensureProject(env, projectId);
  const id = newId();
  await env.DB.prepare(
    "INSERT INTO keywords (id, project_id, keyword, country, language, search_intent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, projectId, keyword, country, language, intent, isoNow()).run();
  for (const s of suggestions.slice(0, 50)) {
    await env.DB.prepare(
      "INSERT INTO keyword_suggestions (id, keyword_id, suggestion, created_at) VALUES (?, ?, ?, ?)"
    ).bind(newId(), id, s, isoNow()).run();
  }
  return { stored: true, id };
}

export async function logAiJob(env, { projectId = "default", task, model, promptVersion, status, result = null }) {
  if (!hasDb(env)) return { stored: false, reason: "no_db" };
  await ensureProject(env, projectId);
  const id = newId();
  await env.DB.prepare(
    "INSERT INTO ai_jobs (id, project_id, task, model, prompt_version, status, result, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, projectId, task, model, promptVersion, status, result ? JSON.stringify(result) : null, isoNow()).run();
  return { stored: true, id };
}
