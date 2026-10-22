require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

// Stop early with a clear message instead of running insecurely
for (const name of ['JWT_SECRET', 'DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD']) {
    if (!process.env[name]) {
        console.error(`Missing ${name} in .env (see .env.example)`);
        process.exit(1);
    }
}

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const customersRoutes = require('./routes/customers');
const insuranceRoutes = require('./routes/insurance');
const insurersRoutes = require('./routes/insurers');
const investmentsRoutes = require('./routes/investments');
const dueQueueRoutes = require('./routes/dueQueue');
const portalRoutes = require('./routes/portal');
const usersRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');

const path = require('path');
const monitoring = require('./services/monitoringService');

const app = express();

// Needed behind a hosting provider's proxy so rate limiting sees the real client IP
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(monitoring.middleware);   // CloudWatch counts (only when AWS_MONITORING=on)

// Basic security headers
app.use((req, res, next) => {
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'same-origin',
    });
    next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
// Office (Admin/Staff only)
app.use('/api/auth', authRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/policies', insuranceRoutes);
app.use('/api/insurers', insurersRoutes);
app.use('/api/investments', investmentsRoutes);
app.use('/api/due-queue', dueQueueRoutes);
app.use('/api', searchRoutes);           // /api/search, /api/dashboard
// Office team management (Admin only)
app.use('/api/users', usersRoutes);
// Customer portal (Customer only, own data)
app.use('/api/portal', portalRoutes);

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`CloudCover Server running on port ${PORT}`);
    monitoring.start();
});

// Send the last CloudWatch numbers/logs before stopping (Ctrl+C, nodemon restart)
for (const signal of ['SIGINT', 'SIGTERM', 'SIGUSR2']) {
    process.once(signal, async () => {
        await monitoring.flush();
        server.close(() => process.exit(0));
        setTimeout(() => process.exit(0), 3000).unref();
    });
}
