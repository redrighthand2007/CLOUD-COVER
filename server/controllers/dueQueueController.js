const db = require('../db');

exports.getDueQueue = async (req, res) => {
    try {
        // Due queue logic:
        // 1. Missed/Overdue: next_due_date < today AND current_payment_state = 'Pending'
        // 2. Upcoming: next_due_date between today and today + 5 days AND current_payment_state = 'Pending'
        
        const missedQuery = `
            SELECT p.id, p.policy_name, p.next_due_date, p.current_payment_state, c.full_name as customer_name, 'Missed' as due_status
            FROM insurance_policies p
            JOIN customers c ON p.customer_id = c.id
            WHERE p.next_due_date < CURRENT_DATE 
              AND (p.current_payment_state = 'Pending' OR p.current_payment_state IS NULL)
              AND p.policy_status = 'Active'
            ORDER BY p.next_due_date ASC
        `;
        
        const upcomingQuery = `
            SELECT p.id, p.policy_name, p.next_due_date, p.current_payment_state, c.full_name as customer_name, 'Upcoming' as due_status
            FROM insurance_policies p
            JOIN customers c ON p.customer_id = c.id
            WHERE p.next_due_date >= CURRENT_DATE 
              AND p.next_due_date <= CURRENT_DATE + INTERVAL '5 days'
              AND (p.current_payment_state = 'Pending' OR p.current_payment_state IS NULL)
              AND p.policy_status = 'Active'
            ORDER BY p.next_due_date ASC
        `;

        const [missedResult, upcomingResult] = await Promise.all([
            db.query(missedQuery),
            db.query(upcomingQuery)
        ]);

        res.json({
            missed: missedResult.rows,
            upcoming: upcomingResult.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
