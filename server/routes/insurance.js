const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insuranceController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);

router.get('/', insuranceController.getAllPolicies);
router.get('/:id', insuranceController.getPolicyById);
router.post('/', insuranceController.createPolicy);
router.put('/:id', insuranceController.updatePolicy);
router.delete('/:id', requireAdmin, insuranceController.deletePolicy);
router.post('/:id/mark-paid', insuranceController.markPaid);

module.exports = router;
