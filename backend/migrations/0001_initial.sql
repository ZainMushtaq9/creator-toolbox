-- CreatorToolbox D1 initial migration (blueprint section 7.3 + remaining tables as stubs).
-- Apply: npx wrangler d1 migrations apply creator_toolbox --remote
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS keywords (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  keyword TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  language TEXT DEFAULT 'en',
  search_intent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(project_id) REFERENCES projects(id)
);
CREATE TABLE IF NOT EXISTS competitors (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  url TEXT NOT NULL,
  domain TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(project_id) REFERENCES projects(id)
);
CREATE TABLE IF NOT EXISTS page_audits (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  url TEXT NOT NULL,
  score INTEGER,
  audit_data TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(project_id) REFERENCES projects(id)
);
CREATE TABLE IF NOT EXISTS seo_recommendations (
  id TEXT PRIMARY KEY,
  audit_id TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(audit_id) REFERENCES page_audits(id)
);
CREATE TABLE IF NOT EXISTS gsc_metrics (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  date TEXT NOT NULL,
  page TEXT,
  query TEXT,
  country TEXT,
  device TEXT,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr REAL DEFAULT 0,
  position REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(project_id) REFERENCES projects(id)
);
-- Remaining tables (Phase 4/5): stub definitions, to be expanded with
-- unique constraints and encrypted-token handling before production.
CREATE TABLE IF NOT EXISTS tool_usage (
  id TEXT PRIMARY KEY, tool_slug TEXT NOT NULL, count INTEGER DEFAULT 0,
  day TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tool_slug, day)
);
CREATE TABLE IF NOT EXISTS keyword_suggestions (
  id TEXT PRIMARY KEY, keyword_id TEXT NOT NULL, suggestion TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(keyword_id) REFERENCES keywords(id)
);
CREATE TABLE IF NOT EXISTS page_snapshots (
  id TEXT PRIMARY KEY, audit_id TEXT NOT NULL, metadata TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(audit_id) REFERENCES page_audits(id)
);
CREATE TABLE IF NOT EXISTS keyword_comparisons (
  id TEXT PRIMARY KEY, project_id TEXT NOT NULL, comparison_data TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(project_id) REFERENCES projects(id)
);
CREATE TABLE IF NOT EXISTS gsc_connections (
  id TEXT PRIMARY KEY, project_id TEXT NOT NULL,
  encrypted_refresh_token TEXT NOT NULL, token_iv TEXT NOT NULL,
  property_url TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(project_id) REFERENCES projects(id)
);
CREATE TABLE IF NOT EXISTS gsc_sync_logs (
  id TEXT PRIMARY KEY, connection_id TEXT NOT NULL, status TEXT NOT NULL,
  message TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(connection_id) REFERENCES gsc_connections(id)
);
CREATE TABLE IF NOT EXISTS ai_jobs (
  id TEXT PRIMARY KEY, project_id TEXT, task TEXT NOT NULL,
  model TEXT, prompt_version TEXT, status TEXT DEFAULT 'pending',
  result TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY, project_id TEXT, type TEXT NOT NULL,
  report_data TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_keyword_project ON keywords(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_project ON page_audits(project_id);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON gsc_metrics(project_id, date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_metrics_unique ON gsc_metrics(project_id, date, page, query, country, device);
