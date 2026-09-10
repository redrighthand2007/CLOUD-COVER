-- Dummy data for CloudCover

-- Assuming password is 'password123' for all, hashed with bcrypt (hash shown is a typical bcrypt hash for password123)
INSERT INTO users (username, password_hash, role, full_name) VALUES
('admin_father', '$2b$10$EixZaYVK1fsbw1ZfZTzxeeVOLccHQrN5wPz.jQGZqV7KkX0v8/W4q', 'Admin', 'Admin Father'),
('admin_mother', '$2b$10$EixZaYVK1fsbw1ZfZTzxeeVOLccHQrN5wPz.jQGZqV7KkX0v8/W4q', 'Admin', 'Admin Mother'),
('staff_emp1', '$2b$10$EixZaYVK1fsbw1ZfZTzxeeVOLccHQrN5wPz.jQGZqV7KkX0v8/W4q', 'Staff', 'Employee One'),
('staff_emp2', '$2b$10$EixZaYVK1fsbw1ZfZTzxeeVOLccHQrN5wPz.jQGZqV7KkX0v8/W4q', 'Staff', 'Employee Two');

INSERT INTO insurers (name) VALUES
('LIC of India'),
('HDFC Life'),
('Star Health'),
('ICICI Lombard'),
('SBI Life');

INSERT INTO customers (full_name, pan, primary_phone, email, address, date_of_birth) VALUES
('Rahul Sharma', 'ABCDE1234F', '9876543210', 'rahul@example.com', '123 Main St, Mumbai', '1985-05-15'),
('Priya Patel', 'FGHIJ5678K', '9876543211', 'priya@example.com', '456 Elm St, Delhi', '1990-08-22');

INSERT INTO insurance_policies (customer_id, policyholder_pan, category, insurer_id, policy_name, policy_number, premium_amount, total_tenure_years, policy_start_date, policy_end_date, premium_start_date, premium_end_date, premium_frequency, next_due_date, current_payment_state, policy_status) VALUES
(1, 'ABCDE1234F', 'Life', 1, 'Jeevan Anand', 'LIC123456789', 5000.00, 20, '2020-01-01', '2040-01-01', '2020-01-01', '2040-01-01', 'Monthly', CURRENT_DATE + INTERVAL '3 days', 'Pending', 'Active'),
(1, 'ABCDE1234F', 'Health', 3, 'Optima Restore', 'STAR987654321', 15000.00, 1, '2023-05-10', '2024-05-10', '2023-05-10', '2024-05-10', 'Yearly', CURRENT_DATE - INTERVAL '2 days', 'Pending', 'Due'),
(2, 'FGHIJ5678K', 'Motor', 4, 'Comprehensive Car Insurance', 'ICICI11223344', 12000.00, 1, '2023-10-15', '2024-10-15', '2023-10-15', '2024-10-15', 'Single Premium', NULL, 'Paid', 'Active');

INSERT INTO investments (customer_id, investment_type, amc_company, scheme_name, folio_number, investment_amount, start_date, frequency, status) VALUES
(1, 'Mutual Fund', 'HDFC AMC', 'HDFC Mid-Cap Opportunities', 'FOLIO12345', 2000.00, '2021-06-01', 'Monthly', 'Active'),
(2, 'Fixed Deposit', 'SBI', 'SBI 5-Year FD', 'FD98765', 100000.00, '2022-01-15', 'Lumpsum', 'Active');
