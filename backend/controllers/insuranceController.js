const db = require('../db');
const { calculateNextDueDate } = require('../services/dueQueueService');
const { logAudit } = require('../services/auditService');
const { validatePolicy } = require('../validators');

const POLICY_FIELDS = [
    'customer_id', 'policyholder_pan', 'category', 'insurer_id', 'policy_name',
    'policy_number', 'premium_amount', 'total_tenure_years', 'policy_start_date',
    'policy_end_date', 'premium_start_date', 'premium_end_date', 'premium_frequency',
    'next_due_date', 'current_payment_state', 'policy_status', 'notes'
];

const sendDbError = (res, err) => {
    if (err.code === '23505') return res.status(409).json({ error: 'A policy with this policy number already exists' });
    if (err.code === '23503') return res.status(400).json({ error: 'The chosen customer or insurer does not exist' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
};

// Fill in values the form may leave empty: a new policy's first due date is its premium start date
function withDefaults(body) {
    const policy = { ...body };
    if (!policy.next_due_date && policy.premium_frequency !== 'Single Premium') {
        policy.next_due_date = policy.premium_start_date;
    }
    policy.current_payment_state = policy.current_payment_state || 'Pending';
    policy.policy_status = policy.policy_status || 'Active';
    return policy;
}

exports.getAllPolicies = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT p.*, c.full_name as customer_name, i.name as insurer_name
            FROM insurance_policies p
            JOIN customers c ON p.customer_id = c.id
            LEFT JOIN insurers i ON p.insurer_id = i.id
            ORDER BY p.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.getPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM insurance_policies WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.createPolicy = async (req, res) => {
    try {
        const { data, error } = validatePolicy(withDefaults(req.body));
        if (error) return res.status(400).json({ error });
        const values = POLICY_FIELDS.map(f => data[f]);
        const placeholders = POLICY_FIELDS.map((_, i) => `$${i + 1}`).join(', ');

        const { rows } = await db.query(
            `INSERT INTO insurance_policies (${POLICY_FIELDS.join(', ')}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        await logAudit(req.user, 'CREATE', 'insurance_policies', rows[0].id, null, rows[0]);
        res.status(201).json(rows[0]);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.updatePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const before = await db.query('SELECT * FROM insurance_policies WHERE id = $1', [id]);
        if (before.rows.length === 0) return res.status(404).json({ error: 'Not found' });

        // Keep the stored due date and payment state unless the form sends new ones
        const { data, error } = validatePolicy(withDefaults({ ...before.rows[0], ...req.body }));
        if (error) return res.status(400).json({ error });
        const values = POLICY_FIELDS.map(f => data[f]);
        const placeholders = POLICY_FIELDS.map((f, i) => `${f}=$${i + 1}`).join(', ');

        const { rows } = await db.query(
            `UPDATE insurance_policies SET ${placeholders} WHERE id = $${POLICY_FIELDS.length + 1} RETURNING *`,
            [...values, id]
        );
        await logAudit(req.user, 'UPDATE', 'insurance_policies', rows[0].id, before.rows[0], rows[0]);
        res.json(rows[0]);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.deletePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('DELETE FROM insurance_policies WHERE id = $1 RETURNING *', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        await logAudit(req.user, 'DELETE', 'insurance_policies', rows[0].id, rows[0], null);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        sendDbError(res, err);
    }
};

// Record the payment for the current due date, then move the policy to its next due date.
// Both happen in one transaction, so history and due date can never disagree.
exports.markPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.transaction(async (client) => {
            const { rows } = await client.query('SELECT * FROM insurance_policies WHERE id = $1 FOR UPDATE', [id]);
            if (rows.length === 0) return null;
            const policy = rows[0];

            await client.query(
                `INSERT INTO premium_payments (policy_id, due_date, amount, recorded_by, notes)
                 VALUES ($1, $2, $3, $4, $5)`,
                [id, policy.next_due_date, req.body.amount || policy.premium_amount, req.user.id, req.body.notes || null]
            );

            const newDueDate = calculateNextDueDate(policy.next_due_date, policy.premium_frequency, policy.premium_end_date);
            // If another premium is due, the new cycle starts unpaid; otherwise all premiums are paid
            const newState = newDueDate ? 'Pending' : 'Paid';

            const updated = await client.query(
                `UPDATE insurance_policies SET current_payment_state = $1, next_due_date = $2 WHERE id = $3 RETURNING *`,
                [newState, newDueDate, id]
            );
            return { before: policy, after: updated.rows[0] };
        });

        if (!result) return res.status(404).json({ error: 'Not found' });
        await logAudit(req.user, 'MARK_PAID', 'insurance_policies', result.after.id, result.before, result.after);
        res.json(result.after);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.getPayments = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query(
            `SELECT pp.*, u.full_name AS recorded_by_name
             FROM premium_payments pp
             LEFT JOIN users u ON u.id = pp.recorded_by
             WHERE pp.policy_id = $1
             ORDER BY pp.paid_on DESC, pp.id DESC`,
            [id]
        );
        res.json(rows);
    } catch (err) {
        sendDbError(res, err);
    }
};
