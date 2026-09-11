const db = require('../db');
const { calculateNextDueDate } = require('../services/dueQueueService');

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
        res.status(500).json({ error: err.message });
    }
};

exports.getPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM insurance_policies WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createPolicy = async (req, res) => {
    try {
        const fields = [
            'customer_id', 'policyholder_pan', 'category', 'insurer_id', 'policy_name', 
            'policy_number', 'premium_amount', 'total_tenure_years', 'policy_start_date', 
            'policy_end_date', 'premium_start_date', 'premium_end_date', 'premium_frequency', 
            'next_due_date', 'current_payment_state', 'policy_status', 'notes'
        ];
        const values = fields.map(f => req.body[f]);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
        
        const { rows } = await db.query(
            `INSERT INTO insurance_policies (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const fields = [
            'customer_id', 'policyholder_pan', 'category', 'insurer_id', 'policy_name', 
            'policy_number', 'premium_amount', 'total_tenure_years', 'policy_start_date', 
            'policy_end_date', 'premium_start_date', 'premium_end_date', 'premium_frequency', 
            'next_due_date', 'current_payment_state', 'policy_status', 'notes'
        ];
        const values = fields.map(f => req.body[f]);
        const placeholders = fields.map((f, i) => `${f}=$${i + 1}`).join(', ');
        
        const { rows } = await db.query(
            `UPDATE insurance_policies SET ${placeholders} WHERE id = $${fields.length + 1} RETURNING *`,
            [...values, id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM insurance_policies WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT next_due_date, premium_frequency FROM insurance_policies WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        
        const policy = rows[0];
        const newDueDate = calculateNextDueDate(policy.next_due_date, policy.premium_frequency);
        
        const updated = await db.query(
            `UPDATE insurance_policies SET current_payment_state = 'Paid', next_due_date = $1 WHERE id = $2 RETURNING *`,
            [newDueDate, id]
        );
        res.json(updated.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
