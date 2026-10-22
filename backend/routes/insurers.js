const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireStaff } = require('../middleware/auth');
const { logAudit } = require('../services/auditService');

router.use(authenticate, requireStaff);

router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT id, name FROM insurers ORDER BY name');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a new insurance company to the list
router.post('/', async (req, res) => {
    const name = String(req.body.name || '').trim().replace(/\s+/g, ' ');
    if (name.length < 2 || name.length > 150) {
        return res.status(400).json({ error: 'Insurer name is required (2-150 characters)' });
    }
    try {
        const existing = await db.query('SELECT id, name FROM insurers WHERE LOWER(name) = LOWER($1)', [name]);
        if (existing.rows.length) return res.status(409).json({ error: `${existing.rows[0].name} is already in the list` });

        const { rows } = await db.query('INSERT INTO insurers (name) VALUES ($1) RETURNING id, name', [name]);
        await logAudit(req.user, 'CREATE', 'insurers', rows[0].id, null, rows[0]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
