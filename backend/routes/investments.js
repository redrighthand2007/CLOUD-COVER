const express = require('express');
const router = express.Router();
const investmentsController = require('../controllers/investmentsController');
const { authenticate, requireStaff, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireStaff);

router.get('/', investmentsController.getAllInvestments);
router.get('/:id', investmentsController.getInvestmentById);
router.post('/', investmentsController.createInvestment);
router.put('/:id', investmentsController.updateInvestment);
router.delete('/:id', requireAdmin, investmentsController.deleteInvestment);

module.exports = router;
