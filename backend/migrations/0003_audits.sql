-- Phase 5: audit / recommendations / AI-job indexes.
-- Tables (page_audits, page_snapshots, keyword_comparisons,
-- seo_recommendations, ai_jobs, reports) are created in 0001_initial.sql.
CREATE INDEX IF NOT EXISTS idx_audits_url ON page_audits(project_id, url);
CREATE INDEX IF NOT EXISTS idx_audits_created ON page_audits(created_at);
CREATE INDEX IF NOT EXISTS idx_snapshots_audit ON page_snapshots(audit_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_project
  ON keyword_comparisons(project_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_audit
  ON seo_recommendations(audit_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_status
  ON seo_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_project ON ai_jobs(project_id, task);
CREATE INDEX IF NOT EXISTS idx_reports_project ON reports(project_id, type);
-- Retention: old snapshots are pruned by the application (Phase 5),
-- not by the database; keep at most the latest snapshot per audit.
