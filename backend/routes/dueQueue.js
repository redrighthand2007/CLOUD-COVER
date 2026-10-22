const express = require('express');
const router = express.Router();
const dueQueueController = require('../controllers/dueQueueController');
const { authenticate, requireStaff } = require('../middleware/auth');

router.use(authenticate, requireStaff);
router.get('/', dueQueueController.getDueQueue);

module.exports = router;
