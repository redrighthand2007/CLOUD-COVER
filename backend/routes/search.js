const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticate, requireStaff } = require('../middleware/auth');

// Mounted at /api, so checks go on each route (a router.use here would also
// run for every other /api request, e.g. the customer portal).
router.get('/search', authenticate, requireStaff, searchController.search);
router.get('/dashboard', authenticate, requireStaff, searchController.dashboardSummary);

module.exports = router;
