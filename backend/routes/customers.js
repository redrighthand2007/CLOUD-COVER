const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customersController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);

router.get('/', customersController.getAllCustomers);
router.get('/:id', customersController.getCustomerById);
router.post('/', customersController.createCustomer);
router.put('/:id', customersController.updateCustomer);
router.delete('/:id', requireAdmin, customersController.deleteCustomer);

module.exports = router;
