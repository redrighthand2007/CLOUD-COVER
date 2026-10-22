const db = require('../db');
const { logAudit } = require('../services/auditService');
const { validateInvestment } = require('../validators');

const sendDbError = (res, err) => {
    if (err.code === '23503') return res.status(400).json({ error: 'The chosen customer does not exist' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
};

exports.getAllInvestments = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT i.*, c.full_name as customer_name
            FROM investments i
            JOIN customers c ON i.customer_id = c.id
            ORDER BY i.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.getInvestmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM investments WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.createInvestment = async (req, res) => {
    try {
        const { data, error } = validateInvestment(req.body);
        if (error) return res.status(400).json({ error });
        const { customer_id, investment_type, amc_company, scheme_name, folio_number, investment_amount, start_date, frequency, status, notes } = data;
        const { rows } = await db.query(
            `INSERT INTO investments (customer_id, investment_type, amc_company, scheme_name, folio_number, investment_amount, start_date, frequency, status, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [customer_id, investment_type, amc_company, scheme_name, folio_number, investment_amount, start_date, frequency, status, notes]
        );
        await logAudit(req.user, 'CREATE', 'investments', rows[0].id, null, rows[0]);
        res.status(201).json(rows[0]);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.updateInvestment = async (req, res) => {
    try {
        const { id } = req.params;
        const before = await db.query('SELECT * FROM investments WHERE id = $1', [id]);
        if (before.rows.length === 0) return res.status(404).json({ error: 'Not found' });

        const { data, error } = validateInvestment(req.body);
        if (error) return res.status(400).json({ error });
        const { customer_id, investment_type, amc_company, scheme_name, folio_number, investment_amount, start_date, frequency, status, notes } = data;
        const { rows } = await db.query(
            `UPDATE investments SET customer_id=$1, investment_type=$2, amc_company=$3, scheme_name=$4, folio_number=$5, investment_amount=$6, start_date=$7, frequency=$8, status=$9, notes=$10
             WHERE id=$11 RETURNING *`,
            [customer_id, investment_type, amc_company, scheme_name, folio_number, investment_amount, start_date, frequency, status, notes, id]
        );
        await logAudit(req.user, 'UPDATE', 'investments', rows[0].id, before.rows[0], rows[0]);
        res.json(rows[0]);
    } catch (err) {
        sendDbError(res, err);
    }
};

exports.deleteInvestment = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('DELETE FROM investments WHERE id = $1 RETURNING *', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        await logAudit(req.user, 'DELETE', 'investments', rows[0].id, rows[0], null);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        sendDbError(res, err);
    }
};
