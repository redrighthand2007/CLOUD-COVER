const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customersController');
const { authenticate, requireStaff, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireStaff);

router.get('/', customersController.getAllCustomers);
router.get('/:id', customersController.getCustomerById);
router.post('/', customersController.createCustomer);
router.put('/:id', customersController.updateCustomer);
router.delete('/:id', requireAdmin, customersController.deleteCustomer);

// Customer app login, managed by the office
router.put('/:id/app-account', customersController.setAppAccount);
router.delete('/:id/app-account', requireAdmin, customersController.disableAppAccount);

module.exports = router;
