-- Migration 001: customer portal + payment history
-- For databases created from the old schema.sql. New databases get this from schema.sql directly.
-- Safe to run more than once.

CREATE TABLE IF NOT EXISTS customer_accounts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS premium_payments (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER NOT NULL REFERENCES insurance_policies(id) ON DELETE CASCADE,
    due_date DATE,
    paid_on DATE NOT NULL DEFAULT CURRENT_DATE,
    amount NUMERIC(12, 2) NOT NULL,
    recorded_by INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_policies_customer ON insurance_policies(customer_id);
CREATE INDEX IF NOT EXISTS idx_policies_next_due ON insurance_policies(next_due_date);
CREATE INDEX IF NOT EXISTS idx_investments_customer ON investments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_policy ON premium_payments(policy_id);

DROP TRIGGER IF EXISTS update_customer_accounts_updated_at ON customer_accounts;
CREATE TRIGGER update_customer_accounts_updated_at BEFORE UPDATE ON customer_accounts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
