const db = require('../db');
const { getSummary } = require('../services/statsService');

// Global office search: one box that finds customers, policies and investments
// by name, PAN, phone, email, policy number, insurer, folio or scheme.
exports.search = async (req, res) => {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json({ customers: [], policies: [], investments: [] });

    // Treat % and _ typed by the user as plain characters, not wildcards
    const pattern = `%${q.replace(/[\\%_]/g, ch => '\\' + ch)}%`;
    const digits = q.replace(/\D/g, '');
    const phonePattern = digits.length >= 4 ? `%${digits}%` : null;

    try {
        const [customers, policies, investments] = await Promise.all([
            db.query(
                `SELECT id, full_name, pan, primary_phone FROM customers
                 WHERE full_name ILIKE $1 OR pan ILIKE $1 OR email ILIKE $1
                    OR ($2::text IS NOT NULL AND primary_phone LIKE $2)
                 ORDER BY full_name LIMIT 10`,
                [pattern, phonePattern]
            ),
            db.query(
                `SELECT p.id, p.policy_name, p.policy_number, p.policy_status, p.next_due_date,
                        c.id AS customer_id, c.full_name AS customer_name, i.name AS insurer_name
                 FROM insurance_policies p
                 JOIN customers c ON c.id = p.customer_id
                 LEFT JOIN insurers i ON i.id = p.insurer_id
                 WHERE p.policy_number ILIKE $1 OR p.policy_name ILIKE $1 OR i.name ILIKE $1 OR c.full_name ILIKE $1
                 ORDER BY p.policy_name LIMIT 10`,
                [pattern]
            ),
            db.query(
                `SELECT v.id, v.scheme_name, v.folio_number, v.amc_company, v.status,
                        c.id AS customer_id, c.full_name AS customer_name
                 FROM investments v
                 JOIN customers c ON c.id = v.customer_id
                 WHERE v.folio_number ILIKE $1 OR v.scheme_name ILIKE $1 OR v.amc_company ILIKE $1 OR c.full_name ILIKE $1
                 ORDER BY v.scheme_name LIMIT 10`,
                [pattern]
            ),
        ]);
        res.json({ customers: customers.rows, policies: policies.rows, investments: investments.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Numbers for the dashboard cards
exports.dashboardSummary = async (req, res) => {
    try {
        res.json(await getSummary());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
