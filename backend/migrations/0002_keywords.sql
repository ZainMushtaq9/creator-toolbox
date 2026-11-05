-- Phase 4: keyword research indexes and uniqueness.
-- Tables themselves (keywords, keyword_suggestions, competitors) are
-- created in 0001_initial.sql; this migration adds the indexes and
-- constraints the keywordResearch service relies on.
CREATE UNIQUE INDEX IF NOT EXISTS idx_keywords_unique
  ON keywords(project_id, keyword, country, language);
CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_suggestions_keyword
  ON keyword_suggestions(keyword_id);
CREATE INDEX IF NOT EXISTS idx_competitors_project
  ON competitors(project_id);
CREATE INDEX IF NOT EXISTS idx_competitors_domain ON competitors(domain);
