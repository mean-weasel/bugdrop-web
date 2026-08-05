CREATE TABLE IF NOT EXISTS monitoring_components (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'unknown'
    CHECK (status IN ('unknown', 'operational', 'degraded', 'outage')),
  impact_on_failure text NOT NULL
    CHECK (impact_on_failure IN ('degraded', 'outage')),
  failure_threshold integer NOT NULL CHECK (failure_threshold > 0),
  recovery_threshold integer NOT NULL CHECK (recovery_threshold > 0),
  consecutive_failures integer NOT NULL DEFAULT 0,
  consecutive_successes integer NOT NULL DEFAULT 0,
  last_checked_at timestamptz,
  last_verified_at timestamptz,
  last_failure_at timestamptz,
  last_latency_ms integer,
  last_error_code text,
  open_incident_id uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monitoring_incidents (
  id uuid PRIMARY KEY,
  component_id text NOT NULL REFERENCES monitoring_components(id),
  state text NOT NULL CHECK (state IN ('open', 'resolved')),
  impact text NOT NULL CHECK (impact IN ('degraded', 'outage')),
  title text NOT NULL,
  public_message text NOT NULL,
  started_at timestamptz NOT NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS monitoring_incidents_recent_idx
  ON monitoring_incidents (started_at DESC);
CREATE INDEX IF NOT EXISTS monitoring_incidents_component_idx
  ON monitoring_incidents (component_id, started_at DESC);

CREATE TABLE IF NOT EXISTS monitoring_events (
  id bigserial PRIMARY KEY,
  component_id text NOT NULL REFERENCES monitoring_components(id),
  incident_id uuid REFERENCES monitoring_incidents(id),
  kind text NOT NULL,
  message text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS monitoring_events_recent_idx
  ON monitoring_events (occurred_at DESC);

CREATE TABLE IF NOT EXISTS monitoring_check_results (
  id bigserial PRIMARY KEY,
  component_id text NOT NULL REFERENCES monitoring_components(id),
  checked_at timestamptz NOT NULL,
  ok boolean NOT NULL,
  latency_ms integer,
  error_code text
);

CREATE INDEX IF NOT EXISTS monitoring_check_results_component_time_idx
  ON monitoring_check_results (component_id, checked_at DESC);

CREATE TABLE IF NOT EXISTS monitoring_heartbeat_receipts (
  id bigserial PRIMARY KEY,
  received_at timestamptz NOT NULL DEFAULT now(),
  request_id_hash text UNIQUE
);

CREATE INDEX IF NOT EXISTS monitoring_heartbeat_recent_idx
  ON monitoring_heartbeat_receipts (received_at DESC);

CREATE TABLE IF NOT EXISTS monitoring_alert_outbox (
  id uuid PRIMARY KEY,
  incident_id uuid NOT NULL REFERENCES monitoring_incidents(id),
  event_kind text NOT NULL CHECK (event_kind IN ('opened', 'resolved')),
  channel text NOT NULL CHECK (channel IN ('webhook', 'email')),
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'delivered', 'skipped')),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz,
  delivered_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (incident_id, event_kind, channel)
);

CREATE INDEX IF NOT EXISTS monitoring_alert_pending_idx
  ON monitoring_alert_outbox (next_attempt_at)
  WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS monitoring_meta (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monitoring_locks (
  name text PRIMARY KEY,
  locked_until timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
