-- Migration 003: link office users to their AWS Cognito account (MFA login)
-- cognito_sub is Cognito's permanent user id. It is saved on the first Cognito login;
-- after that, only that exact Cognito account can log in as this office user, even if
-- someone later creates another Cognito user with the same username.
-- Safe to run more than once.

ALTER TABLE users ADD COLUMN IF NOT EXISTS cognito_sub VARCHAR(64);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_cognito_sub ON users(cognito_sub) WHERE cognito_sub IS NOT NULL;
