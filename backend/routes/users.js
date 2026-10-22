const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Office team management: Admin only. Accounts are turned off, never deleted,
// so the audit log keeps pointing at real people.
router.use(authenticate, requireAdmin);

router.get('/', usersController.getAllUsers);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);

module.exports = router;
