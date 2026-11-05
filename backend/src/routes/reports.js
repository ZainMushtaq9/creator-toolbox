// Report storage routes (Phase 4) — owner-only, require ADMIN_TOKEN.
// GET    /api/v1/reports — list reports (newest first).
// POST   /api/v1/reports — save a report { type, reportData }.
// GET    /api/v1/reports/:id — one report.
// DELETE /api/v1/reports/:id — delete a report.
// Reports are stored in D1 (table `reports`) with prepared statements.
// With no D1 bound, reads return an empty list and writes report
// { stored: false, reason: "no_db" } — never a fake success.
import { z } from "zod";
import { envelope, envelopeError, parseJsonBody, validateBody } from "../utils/envelope.js";
import { isAdmin } from "../security/authentication.js";
import { insertReport, listReports, getReport, deleteReport } from "../utils/db.js";

const createSchema = z.object({
  type: z.string().min(1).max(50),
  reportData: z.record(z.unknown()),
  projectId: z.string().max(100).optional().default("default"),
});

export async function reportsHandler(request, env) {
  if (!isAdmin(request, env)) {
    return envelopeError("unauthorized", "Reports are owner-only. Send a valid Bearer ADMIN_TOKEN (Worker secret).", 401);
  }
  const url = new URL(request.url);
  const path = url.pathname;
  if (path === "/api/v1/reports" && request.method === "GET") {
    const limit = Number(url.searchParams.get("limit") || 20);
    const result = await listReports(env, "default", limit);
    return envelope({ reports: result.reports, stored: result.stored, reason: result.reason || null });
  }
  if (path === "/api/v1/reports" && request.method === "POST") {
    const parsed = await parseJsonBody(request);
    if (!parsed.ok) return envelopeError("invalid_body", parsed.error, 400);
    const v = validateBody(createSchema, parsed.value);
    if (!v.ok) return envelopeError("validation_error", v.error, 400);
    const result = await insertReport(env, { projectId: v.value.projectId, type: v.value.type, reportData: v.value.reportData });
    if (!result.stored) return envelopeError("no_db", "D1 is not bound — the report was not stored.", 503);
    return envelope({ id: result.id }, { status: 201 });
  }
  const idMatch = /^\/api\/v1\/reports\/([A-Za-z0-9_-]{1,64})$/.exec(path);
  if (idMatch && request.method === "GET") {
    const result = await getReport(env, idMatch[1]);
    if (!result.report) return envelopeError("not_found", "Report not found.", 404);
    let data = null;
    try { data = JSON.parse(result.report.report_data); } catch { data = null; }
    return envelope({ ...result.report, report_data: data });
  }
  if (idMatch && request.method === "DELETE") {
    const result = await deleteReport(env, idMatch[1]);
    if (!result.stored) return envelopeError("no_db", "D1 is not bound.", 503);
    if (!result.deleted) return envelopeError("not_found", "Report not found.", 404);
    return envelope({ deleted: true });
  }
  return envelopeError("not_found", `Unknown reports endpoint: ${path}`, 404);
}
