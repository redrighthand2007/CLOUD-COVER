const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');

// At most 10 FAILED login attempts per 15 minutes from one device/network
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts. Please wait 15 minutes and try again.'
});

router.post('/login', loginLimiter, authController.login);
router.get('/me', authenticate, authController.getMe);
router.post('/change-password', authenticate, loginLimiter, authController.changePassword);
router.post('/logout-everywhere', authenticate, authController.logoutEverywhere);
// Logout is handled client-side by deleting the token

module.exports = router;
