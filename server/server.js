require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const customersRoutes = require('./routes/customers');
const insuranceRoutes = require('./routes/insurance');
const investmentsRoutes = require('./routes/investments');
const dueQueueRoutes = require('./routes/dueQueue');

const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/policies', insuranceRoutes);
app.use('/api/investments', investmentsRoutes);
app.use('/api/due-queue', dueQueueRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CloudCover Server running on port ${PORT}`);
});
