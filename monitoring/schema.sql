PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS monitoring_components (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unknown' CHECK (status IN ('unknown', 'operational', 'degraded', 'outage')),
  impact_on_failure TEXT NOT NULL CHECK (impact_on_failure IN ('degraded', 'outage')),
  failure_threshold INTEGER NOT NULL CHECK (failure_threshold > 0),
  recovery_threshold INTEGER NOT NULL CHECK (recovery_threshold > 0),
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  consecutive_successes INTEGER NOT NULL DEFAULT 0,
  last_checked_at TEXT,
  last_verified_at TEXT,
  last_failure_at TEXT,
  last_latency_ms INTEGER,
  last_error_code TEXT,
  open_incident_id TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS monitoring_incidents (
  id TEXT PRIMARY KEY,
  component_id TEXT NOT NULL REFERENCES monitoring_components(id),
  state TEXT NOT NULL CHECK (state IN ('open', 'resolved')),
  impact TEXT NOT NULL CHECK (impact IN ('degraded', 'outage')),
  title TEXT NOT NULL,
  public_message TEXT NOT NULL,
  started_at TEXT NOT NULL,
  resolved_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS monitoring_incidents_recent_idx ON monitoring_incidents (started_at DESC);
CREATE INDEX IF NOT EXISTS monitoring_incidents_component_idx ON monitoring_incidents (component_id, started_at DESC);

CREATE TABLE IF NOT EXISTS monitoring_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id TEXT NOT NULL REFERENCES monitoring_components(id),
  incident_id TEXT REFERENCES monitoring_incidents(id),
  kind TEXT NOT NULL,
  message TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS monitoring_events_recent_idx ON monitoring_events (occurred_at DESC);

CREATE TABLE IF NOT EXISTS monitoring_check_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id TEXT NOT NULL REFERENCES monitoring_components(id),
  checked_at TEXT NOT NULL,
  ok INTEGER NOT NULL CHECK (ok IN (0, 1)),
  latency_ms INTEGER,
  error_code TEXT
);
CREATE INDEX IF NOT EXISTS monitoring_check_results_component_time_idx ON monitoring_check_results (component_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS monitoring_check_results_checked_at_idx ON monitoring_check_results (checked_at);

CREATE TABLE IF NOT EXISTS monitoring_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS monitoring_meta_evaluation_window_updated_at_idx
  ON monitoring_meta (updated_at)
  WHERE key LIKE 'evaluation_window:%';

CREATE TABLE IF NOT EXISTS monitoring_daily_component_rollups (
  component_id TEXT NOT NULL REFERENCES monitoring_components(id),
  day TEXT NOT NULL,
  total_samples INTEGER NOT NULL DEFAULT 0 CHECK (total_samples >= 0),
  operational_samples INTEGER NOT NULL DEFAULT 0 CHECK (operational_samples >= 0),
  degraded_samples INTEGER NOT NULL DEFAULT 0 CHECK (degraded_samples >= 0),
  outage_samples INTEGER NOT NULL DEFAULT 0 CHECK (outage_samples >= 0),
  unknown_samples INTEGER NOT NULL DEFAULT 0 CHECK (unknown_samples >= 0),
  successful_checks INTEGER NOT NULL DEFAULT 0 CHECK (successful_checks >= 0),
  source TEXT NOT NULL DEFAULT 'live' CHECK (source IN ('live', 'backfill')),
  first_checked_at TEXT NOT NULL,
  last_checked_at TEXT NOT NULL,
  PRIMARY KEY (component_id, day)
);
CREATE INDEX IF NOT EXISTS monitoring_daily_rollups_day_idx ON monitoring_daily_component_rollups (day DESC);

WITH daily_checks AS (
  SELECT
    component_id,
    substr(checked_at, 1, 10) AS day,
    COUNT(*) AS total_samples,
    SUM(ok) AS successful_checks,
    MIN(checked_at) AS first_checked_at,
    MAX(checked_at) AS last_checked_at
  FROM monitoring_check_results
  GROUP BY component_id, substr(checked_at, 1, 10)
)
INSERT INTO monitoring_daily_component_rollups (
  component_id, day, total_samples, operational_samples, degraded_samples, outage_samples,
  unknown_samples, successful_checks, source, first_checked_at, last_checked_at
)
SELECT
  daily.component_id,
  daily.day,
  daily.total_samples,
  0,
  0,
  0,
  daily.total_samples,
  daily.successful_checks,
  'backfill',
  daily.first_checked_at,
  daily.last_checked_at
FROM daily_checks daily
WHERE NOT EXISTS (
  SELECT 1 FROM monitoring_meta WHERE key = 'daily_rollups_backfilled'
)
ON CONFLICT (component_id, day) DO NOTHING;

INSERT INTO monitoring_meta (key, value, updated_at)
SELECT 'daily_rollups_backfilled', '{"schemaVersion":1}', strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE NOT EXISTS (
  SELECT 1 FROM monitoring_meta WHERE key = 'daily_rollups_backfilled'
);

CREATE TABLE IF NOT EXISTS monitoring_heartbeat_receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  received_at TEXT NOT NULL,
  request_id_hash TEXT UNIQUE
);
CREATE INDEX IF NOT EXISTS monitoring_heartbeat_recent_idx ON monitoring_heartbeat_receipts (received_at DESC);

CREATE TABLE IF NOT EXISTS monitoring_heartbeat_outcomes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id_hash TEXT NOT NULL UNIQUE,
  schema_version INTEGER NOT NULL CHECK (schema_version = 1),
  outcome TEXT NOT NULL CHECK (outcome IN ('verified', 'delivery_failed', 'inconclusive')),
  reason_code TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  received_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS monitoring_heartbeat_outcomes_observed_idx ON monitoring_heartbeat_outcomes (observed_at DESC);

CREATE TABLE IF NOT EXISTS monitoring_alert_outbox (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL REFERENCES monitoring_incidents(id),
  event_kind TEXT NOT NULL CHECK (event_kind IN ('opened', 'resolved')),
  channel TEXT NOT NULL CHECK (channel IN ('webhook', 'email')),
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'skipped')),
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT NOT NULL,
  locked_until TEXT,
  delivered_at TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (incident_id, event_kind, channel)
);
CREATE INDEX IF NOT EXISTS monitoring_alert_pending_idx ON monitoring_alert_outbox (status, next_attempt_at);

CREATE TABLE IF NOT EXISTS monitoring_locks (
  name TEXT PRIMARY KEY,
  token TEXT NOT NULL,
  locked_until TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
