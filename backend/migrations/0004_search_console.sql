-- Phase 5: Search Console indexes.
-- Tables (gsc_connections, gsc_metrics, gsc_sync_logs) are created in
-- 0001_initial.sql (gsc_metrics already has a unique index on
-- project/date/page/query/country/device).
CREATE INDEX IF NOT EXISTS idx_gsc_conn_project
  ON gsc_connections(project_id);
CREATE INDEX IF NOT EXISTS idx_gsc_metrics_page ON gsc_metrics(page);
CREATE INDEX IF NOT EXISTS idx_gsc_metrics_query ON gsc_metrics(query);
CREATE INDEX IF NOT EXISTS idx_gsc_sync_conn ON gsc_sync_logs(connection_id);
CREATE INDEX IF NOT EXISTS idx_gsc_sync_created ON gsc_sync_logs(created_at);
