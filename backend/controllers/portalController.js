const db = require('../db');

// Customer portal: read-only view of the logged-in customer's own data.
// The customer id ALWAYS comes from the login token, never from the URL or body,
// so one customer can never see another customer's data.

exports.getOverview = async (req, res) => {
    const customerId = req.user.customerId;
    try {
        const [profile, policies, investments, payments] = await Promise.all([
            db.query(
                `SELECT full_name, pan, primary_phone, email, address, date_of_birth
                 FROM customers WHERE id = $1`,
                [customerId]
            ),
            db.query(
                `SELECT p.id, p.category, p.policy_name, p.policy_number, p.premium_amount, p.premium_frequency,
                        p.policy_start_date, p.policy_end_date, p.premium_end_date, p.next_due_date,
                        p.current_payment_state, p.policy_status, i.name AS insurer_name,
                        (p.next_due_date < CURRENT_DATE) AS is_overdue
                 FROM insurance_policies p
                 LEFT JOIN insurers i ON i.id = p.insurer_id
                 WHERE p.customer_id = $1
                 ORDER BY p.next_due_date ASC NULLS LAST, p.policy_name`,
                [customerId]
            ),
            db.query(
                `SELECT investment_type, amc_company, scheme_name, folio_number, investment_amount,
                        start_date, frequency, status
                 FROM investments WHERE customer_id = $1
                 ORDER BY start_date DESC`,
                [customerId]
            ),
            db.query(
                `SELECT pp.paid_on, pp.due_date, pp.amount, p.policy_name, p.policy_number
                 FROM premium_payments pp
                 JOIN insurance_policies p ON p.id = pp.policy_id
                 WHERE p.customer_id = $1
                 ORDER BY pp.paid_on DESC
                 LIMIT 20`,
                [customerId]
            ),
        ]);

        if (profile.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });

        const dues = policies.rows
            .filter(p => p.next_due_date && p.current_payment_state !== 'Paid'
                && !['Lapsed', 'Matured', 'Cancelled'].includes(p.policy_status))
            .map(p => ({
                policy_name: p.policy_name,
                policy_number: p.policy_number,
                insurer_name: p.insurer_name,
                amount: p.premium_amount,
                due_date: p.next_due_date,
                overdue: p.is_overdue,
            }));

        res.json({
            profile: profile.rows[0],
            dues,
            policies: policies.rows,
            investments: investments.rows,
            payments: payments.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
