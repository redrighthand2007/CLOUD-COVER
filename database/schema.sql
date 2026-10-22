-- CloudCover Database Schema

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Staff')),
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    -- Stored in login tokens; raising it ends all open sessions for this user
    token_version INTEGER NOT NULL DEFAULT 0,
    last_login_at TIMESTAMP,
    -- AWS Cognito user id, saved on first MFA login (only used when AUTH_PROVIDER=cognito)
    cognito_sub VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_users_cognito_sub ON users(cognito_sub) WHERE cognito_sub IS NOT NULL;

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    pan VARCHAR(20) UNIQUE NOT NULL,
    primary_phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insurers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insurance_policies (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    policyholder_pan VARCHAR(20),
    category VARCHAR(50) NOT NULL, -- Life, Term, Pension, Health, Mediclaim, Motor, Accidental
    insurer_id INTEGER REFERENCES insurers(id),
    policy_name VARCHAR(150) NOT NULL,
    policy_number VARCHAR(100) UNIQUE NOT NULL,
    premium_amount NUMERIC(12, 2) NOT NULL,
    total_tenure_years INTEGER,
    policy_start_date DATE NOT NULL,
    policy_end_date DATE,
    premium_start_date DATE NOT NULL,
    premium_end_date DATE,
    premium_frequency VARCHAR(30) NOT NULL, -- Monthly, Quarterly, Half-yearly, Yearly, Single Premium
    next_due_date DATE,
    current_payment_state VARCHAR(30) DEFAULT 'Pending', -- Paid, Pending
    policy_status VARCHAR(30) DEFAULT 'Active', -- Active, Due, Overdue, Lapsed, Matured, Cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE investments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    investment_type VARCHAR(50) NOT NULL,
    amc_company VARCHAR(100),
    scheme_name VARCHAR(150) NOT NULL,
    folio_number VARCHAR(100) NOT NULL,
    investment_amount NUMERIC(12, 2) NOT NULL,
    start_date DATE NOT NULL,
    frequency VARCHAR(30), -- Monthly (SIP), Lumpsum
    status VARCHAR(30) DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer logins for the customer portal (one login per customer)
CREATE TABLE customer_accounts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    token_version INTEGER NOT NULL DEFAULT 0,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- History of premiums paid, one row each time "Mark Paid" is used
CREATE TABLE premium_payments (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER NOT NULL REFERENCES insurance_policies(id) ON DELETE CASCADE,
    due_date DATE,
    paid_on DATE NOT NULL DEFAULT CURRENT_DATE,
    amount NUMERIC(12, 2) NOT NULL,
    recorded_by INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_policies_customer ON insurance_policies(customer_id);
CREATE INDEX idx_policies_next_due ON insurance_policies(next_due_date);
CREATE INDEX idx_investments_customer ON investments(customer_id);
CREATE INDEX idx_payments_policy ON premium_payments(policy_id);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function to update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach triggers
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_insurance_policies_updated_at BEFORE UPDATE ON insurance_policies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_customer_accounts_updated_at BEFORE UPDATE ON customer_accounts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
