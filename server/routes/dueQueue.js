const express = require('express');
const router = express.Router();
const dueQueueController = require('../controllers/dueQueueController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', dueQueueController.getDueQueue);

module.exports = router;
