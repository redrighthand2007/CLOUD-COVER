const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;

// Token payloads (tv = token_version at login time):
//   office user: { kind: 'staff',    id, username, role: 'Admin' | 'Staff', name, tv }
//   customer:    { kind: 'customer', customerId, role: 'Customer', name, tv }
const signToken = (payload, expiresIn) => jwt.sign(payload, JWT_SECRET, { expiresIn });

const SESSION_ENDED = { error: 'Your session has ended, please log in again' };

// Checks the token signature, then checks the login is still active and its
// token_version still matches. Raising token_version in the database ends every
// open session for that login immediately. Role and name are re-read from the
// database, so a role change applies at once.
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    let payload;
    try {
        payload = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired session, please log in again' });
    }

    try {
        if (payload.kind === 'staff') {
            const { rows } = await db.query(
                'SELECT id, username, role, full_name, is_active, token_version FROM users WHERE id = $1',
                [payload.id]
            );
            const user = rows[0];
            if (!user || !user.is_active || user.token_version !== payload.tv) return res.status(401).json(SESSION_ENDED);
            req.user = { kind: 'staff', id: user.id, username: user.username, role: user.role, name: user.full_name };
        } else if (payload.kind === 'customer') {
            const { rows } = await db.query(
                `SELECT a.customer_id, a.is_active, a.token_version, c.full_name
                 FROM customer_accounts a JOIN customers c ON c.id = a.customer_id
                 WHERE a.customer_id = $1`,
                [payload.customerId]
            );
            const account = rows[0];
            if (!account || !account.is_active || account.token_version !== payload.tv) return res.status(401).json(SESSION_ENDED);
            req.user = { kind: 'customer', customerId: account.customer_id, role: 'Customer', name: account.full_name };
        } else {
            return res.status(401).json(SESSION_ENDED);
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const requireRole = (...roles) => (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) return next();
    return res.status(403).json({ error: 'You do not have permission to do this' });
};

const requireStaff = requireRole('Admin', 'Staff');
const requireAdmin = requireRole('Admin');
const requireCustomer = requireRole('Customer');

module.exports = { signToken, authenticate, requireStaff, requireAdmin, requireCustomer };
