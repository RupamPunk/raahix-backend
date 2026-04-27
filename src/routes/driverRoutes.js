const express = require('express');
const router = express.Router();
const driverAuthController = require('../controllers/driverAuth.controller');

/**
 * POST /driver/verify-otp
 * Demo OTP verification for the Flutter driver app.
 */
router.post('/verify-otp', driverAuthController.verifyDriverLogin);

module.exports = router;
