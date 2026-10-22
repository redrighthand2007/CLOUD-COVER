const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insuranceController');
const { authenticate, requireStaff, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireStaff);

router.get('/', insuranceController.getAllPolicies);
router.get('/:id', insuranceController.getPolicyById);
router.post('/', insuranceController.createPolicy);
router.put('/:id', insuranceController.updatePolicy);
router.delete('/:id', requireAdmin, insuranceController.deletePolicy);
router.post('/:id/mark-paid', insuranceController.markPaid);
router.get('/:id/payments', insuranceController.getPayments);

module.exports = router;
