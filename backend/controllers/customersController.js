const bcrypt = require('bcryptjs');
const db = require('../db');
const { logAudit } = require('../services/auditService');
const { validateCustomer, normalizePhone } = require('../validators');

const sendDbError = (res, err) => {
    if (err.code === '23505') return res.status(409).json({ error: 'A record with this PAN or phone already exists' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
};

exports.getAllCustomers = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT c.*, (a.id IS NOT NULL AND a.is_active) AS has_app_login
            FROM customers c
            LEFT JOIN customer_accounts a ON a.customer_id = c.id
            ORDER BY c.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customerResult = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
        if (customerResult.rows.length === 0) return res.status(404).json({ error: 'Not found' });

        const [policiesResult, investmentsResult, accountResult] = await Promise.all([
            db.query(
                `SELECT p.*, i.name AS insurer_name FROM insurance_policies p
                 LEFT JOIN insurers i ON i.id = p.insurer_id
                 WHERE p.customer_id = $1 ORDER BY p.next_due_date ASC NULLS LAST`,
                [id]
            ),
            db.query('SELECT * FROM investments WHERE customer_id = $1 ORDER BY start_date DESC', [id]),
            db.query('SELECT phone, is_active, last_login_at FROM customer_accounts WHERE customer_id = $1', [id]),
        ]);

        res.json({
            ...customerResult.rows[0],
            policies: policiesResult.rows,
            investments: investmentsResult.rows,
            app_account: accountResult.rows[0] || null
        });
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { data, error } = validateCustomer(req.body);
        if (error) return res.status(400).json({ error });
        const { full_name, pan, primary_phone, email, address, date_of_birth } = data;
        const { rows } = await db.query(
            `INSERT INTO customers (full_name, pan, primary_phone, email, address, date_of_birth)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [full_name, pan, primary_phone, email, address, date_of_birth]
        );
        await logAudit(req.user, 'CREATE', 'customers', rows[0].id, null, rows[0]);
        res.status(201).json(rows[0]);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = validateCustomer(req.body);
        if (error) return res.status(400).json({ error });
        const { full_name, pan, primary_phone, email, address, date_of_birth } = data;
        const before = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
        if (before.rows.length === 0) return res.status(404).json({ error: 'Not found' });

        const { rows } = await db.query(
            `UPDATE customers SET full_name=$1, pan=$2, primary_phone=$3, email=$4, address=$5, date_of_birth=$6
             WHERE id=$7 RETURNING *`,
            [full_name, pan, primary_phone, email, address, date_of_birth, id]
        );
        await logAudit(req.user, 'UPDATE', 'customers', rows[0].id, before.rows[0], rows[0]);
        res.json(rows[0]);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        await logAudit(req.user, 'DELETE', 'customers', rows[0].id, rows[0], null);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        sendDbError(res, err);
    }
};

// Create or reset the customer's portal login (phone + password set by the office)
exports.setAppAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const phone = normalizePhone(req.body.phone);
        const { password } = req.body;
        if (!phone) return res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number' });
        if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

        const customer = await db.query('SELECT id FROM customers WHERE id = $1', [id]);
        if (customer.rows.length === 0) return res.status(404).json({ error: 'Not found' });

        const hash = await bcrypt.hash(password, 10);
        const { rows } = await db.query(
            `INSERT INTO customer_accounts (customer_id, phone, password_hash, is_active)
             VALUES ($1, $2, $3, TRUE)
             ON CONFLICT (customer_id) DO UPDATE SET phone = EXCLUDED.phone, password_hash = EXCLUDED.password_hash, is_active = TRUE,
                 token_version = customer_accounts.token_version + 1  -- new password logs out old sessions
             RETURNING customer_id, phone, is_active`,
            [id, phone, hash]
        );
        await logAudit(req.user, 'SET_APP_LOGIN', 'customer_accounts', Number(id), null, rows[0]);
        res.json(rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: 'This phone number is already used by another customer login' });
        sendDbError(res, err);
    }
};

// Turn off the customer's portal login (Admin only)
exports.disableAppAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query(
            `UPDATE customer_accounts SET is_active = FALSE, token_version = token_version + 1
             WHERE customer_id = $1 RETURNING customer_id, phone, is_active`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'This customer has no app login' });
        await logAudit(req.user, 'DISABLE_APP_LOGIN', 'customer_accounts', Number(id), null, rows[0]);
        res.json(rows[0]);
    } catch (err) {
        sendDbError(res, err);
    }
};
