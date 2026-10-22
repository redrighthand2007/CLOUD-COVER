const bcrypt = require('bcryptjs');
const db = require('../db');
const { signToken } = require('../middleware/auth');
const { logAudit } = require('../services/auditService');

const INVALID = { error: 'Invalid login details' };
const STAFF_SESSION = '10h';
const CUSTOMER_SESSION = '30d';

const staffProfile = (user) => ({ kind: 'staff', id: user.id, username: user.username, role: user.role, name: user.full_name });
const customerProfile = (account) => ({ kind: 'customer', customerId: account.customer_id, role: 'Customer', name: account.full_name });

// One login endpoint for everyone. The client says which kind of login it is:
//   { type: 'staff',    username, password }
//   { type: 'customer', phone,    password }
exports.login = async (req, res) => {
    const { type, password } = req.body;
    if (!password || (type !== 'staff' && type !== 'customer')) {
        return res.status(400).json({ error: 'Login type and password are required' });
    }

    try {
        if (type === 'staff') return await staffLogin(req.body.username, password, res);
        return await customerLogin(req.body.phone, password, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

async function staffLogin(username, password, res) {
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [(username || '').trim().toLowerCase()]);
    const user = rows[0];
    if (!user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json(INVALID);
    }

    await db.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const profile = staffProfile(user);
    res.json({ token: signToken({ ...profile, tv: user.token_version }, STAFF_SESSION), user: profile });
}

async function customerLogin(phone, password, res) {
    const { rows } = await db.query(
        `SELECT a.*, c.full_name FROM customer_accounts a
         JOIN customers c ON c.id = a.customer_id
         WHERE a.phone = $1`,
        [(phone || '').replace(/\D/g, '').slice(-10)]
    );
    const account = rows[0];
    if (!account || !account.is_active || !(await bcrypt.compare(password, account.password_hash))) {
        return res.status(401).json(INVALID);
    }

    await db.query('UPDATE customer_accounts SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [account.id]);

    const profile = customerProfile(account);
    res.json({ token: signToken({ ...profile, tv: account.token_version }, CUSTOMER_SESSION), user: profile });
}

exports.getMe = async (req, res) => {
    res.json({ user: req.user });
};

// Where the logged-in user's login is stored
function loginRecord(user) {
    return user.kind === 'customer'
        ? { table: 'customer_accounts', idColumn: 'customer_id', id: user.customerId }
        : { table: 'users', idColumn: 'id', id: user.id };
}

// Ends every open session for this login (all phones/PCs), and gives this device a fresh one
async function rotateSessions(user) {
    const { table, idColumn, id } = loginRecord(user);
    const { rows } = await db.query(
        `UPDATE ${table} SET token_version = token_version + 1 WHERE ${idColumn} = $1 RETURNING token_version`,
        [id]
    );
    const profile = { ...user };
    return signToken({ ...profile, tv: rows[0].token_version }, user.kind === 'customer' ? CUSTOMER_SESSION : STAFF_SESSION);
}

// Logged-in user changes their own password (office user or customer).
// All other devices are logged out; this device gets a new token.
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    try {
        const { table, idColumn, id } = loginRecord(req.user);
        const { rows } = await db.query(`SELECT password_hash FROM ${table} WHERE ${idColumn} = $1`, [id]);
        if (!rows[0] || !(await bcrypt.compare(currentPassword, rows[0].password_hash))) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await db.query(`UPDATE ${table} SET password_hash = $1 WHERE ${idColumn} = $2`, [hash, id]);
        const token = await rotateSessions(req.user);
        await logAudit(req.user, 'CHANGE_OWN_PASSWORD', table, id);
        res.json({ message: 'Password changed. Other devices have been logged out.', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Log out on every device (e.g. a phone was lost). This device gets a new session.
exports.logoutEverywhere = async (req, res) => {
    try {
        const token = await rotateSessions(req.user);
        res.json({ message: 'Logged out on all other devices.', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
