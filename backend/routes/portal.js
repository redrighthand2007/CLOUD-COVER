const express = require('express');
const router = express.Router();
const portalController = require('../controllers/portalController');
const { authenticate, requireCustomer } = require('../middleware/auth');

router.use(authenticate, requireCustomer);

router.get('/overview', portalController.getOverview);

module.exports = router;
