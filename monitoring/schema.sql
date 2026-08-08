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

CREATE TABLE IF NOT EXISTS monitoring_heartbeat_receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  received_at TEXT NOT NULL,
  request_id_hash TEXT UNIQUE
);
CREATE INDEX IF NOT EXISTS monitoring_heartbeat_recent_idx ON monitoring_heartbeat_receipts (received_at DESC);

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

CREATE TABLE IF NOT EXISTS monitoring_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS monitoring_locks (
  name TEXT PRIMARY KEY,
  token TEXT NOT NULL,
  locked_until TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
