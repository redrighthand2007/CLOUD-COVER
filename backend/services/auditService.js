const db = require('../db');

// Record who changed what. Never blocks the main action if logging fails.
async function logAudit(user, action, tableName, recordId, oldData = null, newData = null) {
    try {
        await db.query(
            `INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [user && user.kind === 'staff' ? user.id : null, action, tableName, recordId, oldData, newData]
        );
    } catch (err) {
        console.error('Audit log failed:', err.message);
    }
}

module.exports = { logAudit };
