const bcrypt = require('bcryptjs');
const db = require('../db');
const { logAudit } = require('../services/auditService');
const { validateStaffUser } = require('../validators');

// Office team management (Admin only). Never returns password hashes.

const PUBLIC_FIELDS = 'id, username, full_name, role, is_active, last_login_at, created_at';

exports.getAllUsers = async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT ${PUBLIC_FIELDS} FROM users ORDER BY role, full_name`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { data, error } = validateStaffUser(req.body, { creating: true });
        if (error) return res.status(400).json({ error });

        const hash = await bcrypt.hash(data.password, 10);
        const { rows } = await db.query(
            `INSERT INTO users (username, password_hash, role, full_name) VALUES ($1, $2, $3, $4) RETURNING ${PUBLIC_FIELDS}`,
            [data.username, hash, data.role, data.full_name]
        );
        await logAudit(req.user, 'CREATE', 'users', rows[0].id, null, rows[0]);
        res.status(201).json(rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: 'This username is already taken' });
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Change name, role, active status and (optionally) set a new password.
// A new password or turning the account off logs that user out everywhere.
exports.updateUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { data, error } = validateStaffUser(req.body, { creating: false });
        if (error) return res.status(400).json({ error });
        const isActive = req.body.is_active !== false;
        if (data.password && data.password.length < 8) {
            return res.status(400).json({ error: 'New password must be at least 8 characters' });
        }

        const result = await db.transaction(async (client) => {
            const before = await client.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1 FOR UPDATE`, [id]);
            if (before.rows.length === 0) return { status: 404, body: { error: 'Not found' } };

            if (id === req.user.id && (!isActive || data.role !== 'Admin')) {
                return { status: 400, body: { error: 'You cannot turn off or demote your own account' } };
            }

            // Keep at least one active Admin, so the office can never be locked out
            const wasActiveAdmin = before.rows[0].is_active && before.rows[0].role === 'Admin';
            if (wasActiveAdmin && (!isActive || data.role !== 'Admin')) {
                const admins = await client.query("SELECT COUNT(*)::int AS n FROM users WHERE role = 'Admin' AND is_active");
                if (admins.rows[0].n <= 1) return { status: 400, body: { error: 'There must be at least one active Admin' } };
            }

            const endSessions = !!data.password || (before.rows[0].is_active && !isActive);
            const params = [data.full_name, data.role, isActive, endSessions, id];
            let passwordSql = '';
            if (data.password) {
                params.push(await bcrypt.hash(data.password, 10));
                passwordSql = `, password_hash = $${params.length}`;
            }
            const updated = await client.query(
                `UPDATE users SET full_name = $1, role = $2, is_active = $3,
                    token_version = token_version + CASE WHEN $4 THEN 1 ELSE 0 END ${passwordSql}
                 WHERE id = $5 RETURNING ${PUBLIC_FIELDS}`,
                params
            );
            return { status: 200, body: updated.rows[0], before: before.rows[0], passwordChanged: !!data.password };
        });

        if (result.status === 200) {
            await logAudit(req.user, result.passwordChanged ? 'UPDATE_AND_RESET_PASSWORD' : 'UPDATE', 'users', id, result.before, result.body);
        }
        res.status(result.status).json(result.body);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
