const db = require('../db');

// Office numbers used by the dashboard cards and the CloudWatch reporter
async function getSummary() {
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
    return rows[0];
}

module.exports = { getSummary };
