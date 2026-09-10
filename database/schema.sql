-- CloudCover Database Schema

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Staff')),
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
