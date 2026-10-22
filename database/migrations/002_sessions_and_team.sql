-- Migration 002: instant session revocation + office team management
-- token_version is stored inside every login token. Raising it ends all open sessions
-- for that login (password change, reset, login turned off, "log out everywhere").
-- Safe to run more than once.

ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

ALTER TABLE customer_accounts ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;
