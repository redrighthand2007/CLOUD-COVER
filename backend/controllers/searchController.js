const db = require('../db');

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
        const { rows } = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM customers)::int AS total_customers,
                (SELECT COUNT(*) FROM insurance_policies WHERE policy_status = 'Active')::int AS active_policies,
                (SELECT COUNT(*) FROM insurance_policies
                  WHERE next_due_date < CURRENT_DATE AND current_payment_state <> 'Paid'
                    AND policy_status NOT IN ('Lapsed', 'Matured', 'Cancelled'))::int AS missed_dues,
                (SELECT COUNT(*) FROM insurance_policies
                  WHERE next_due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 5 AND current_payment_state <> 'Paid'
                    AND policy_status NOT IN ('Lapsed', 'Matured', 'Cancelled'))::int AS upcoming_dues,
                (SELECT COUNT(*) FROM investments WHERE status = 'Active')::int AS active_investments,
                (SELECT COUNT(*) FROM customer_accounts WHERE is_active)::int AS app_logins,
                (SELECT COALESCE(SUM(amount), 0) FROM premium_payments
                  WHERE paid_on >= date_trunc('month', CURRENT_DATE))::numeric AS collected_this_month
        `);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
