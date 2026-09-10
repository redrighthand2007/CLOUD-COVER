const express = require('express');
const router = express.Router();
const investmentsController = require('../controllers/investmentsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);

router.get('/', investmentsController.getAllInvestments);
router.get('/:id', investmentsController.getInvestmentById);
router.post('/', investmentsController.createInvestment);
router.put('/:id', investmentsController.updateInvestment);
router.delete('/:id', requireAdmin, investmentsController.deleteInvestment);

module.exports = router;
