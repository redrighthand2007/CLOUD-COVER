const db = require('../db');

exports.getAllCustomers = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customerResult = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
        if (customerResult.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        
        const policiesResult = await db.query('SELECT * FROM insurance_policies WHERE customer_id = $1', [id]);
        const investmentsResult = await db.query('SELECT * FROM investments WHERE customer_id = $1', [id]);
        
        res.json({
            ...customerResult.rows[0],
            policies: policiesResult.rows,
            investments: investmentsResult.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { full_name, pan, primary_phone, email, address, date_of_birth } = req.body;
        const { rows } = await db.query(
            `INSERT INTO customers (full_name, pan, primary_phone, email, address, date_of_birth) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [full_name, pan, primary_phone, email, address, date_of_birth]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, pan, primary_phone, email, address, date_of_birth } = req.body;
        const { rows } = await db.query(
            `UPDATE customers SET full_name=$1, pan=$2, primary_phone=$3, email=$4, address=$5, date_of_birth=$6 
             WHERE id=$7 RETURNING *`,
            [full_name, pan, primary_phone, email, address, date_of_birth, id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM customers WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
