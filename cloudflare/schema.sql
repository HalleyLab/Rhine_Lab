PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_iterations INTEGER NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pending_registrations (
  email TEXT PRIMARY KEY COLLATE NOCASE,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_iterations INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_codes (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE,
  purpose TEXT NOT NULL CHECK (purpose IN ('register', 'login')),
  code_hash TEXT NOT NULL,
  request_ip_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_auth_codes_email_created ON auth_codes(email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_codes_ip_created ON auth_codes(request_ip_hash, created_at DESC);

CREATE TABLE IF NOT EXISTS login_attempts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE,
  request_ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email_created ON login_attempts(email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_created ON login_attempts(request_ip_hash, created_at DESC);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS labs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_key TEXT NOT NULL UNIQUE,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_iterations INTEGER NOT NULL,
  key_envelope TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lab_members (
  lab_id TEXT NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'member')),
  created_at TEXT NOT NULL,
  PRIMARY KEY (lab_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_lab_members_user ON lab_members(user_id, created_at);

CREATE TABLE IF NOT EXISTS workspace_snapshots (
  workspace_key TEXT NOT NULL UNIQUE,
  owner_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  object_key TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  payload_sha256 TEXT NOT NULL,
  payload_bytes INTEGER NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lab_member_publications (
  lab_id TEXT NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  object_key TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  payload_sha256 TEXT NOT NULL,
  payload_bytes INTEGER NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (lab_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_publications_lab_updated ON lab_member_publications(lab_id, updated_at);

CREATE TABLE IF NOT EXISTS assistant_device_usage (
  device_hash TEXT NOT NULL,
  usage_date TEXT NOT NULL,
  requests INTEGER NOT NULL DEFAULT 0 CHECK (requests >= 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (device_hash, usage_date)
);
CREATE INDEX IF NOT EXISTS idx_assistant_usage_date ON assistant_device_usage(usage_date);

CREATE TRIGGER IF NOT EXISTS prevent_owner_membership_delete
BEFORE DELETE ON lab_members
WHEN OLD.role = 'owner'
BEGIN
  SELECT RAISE(ABORT, 'LAB owner membership cannot be removed');
END;
