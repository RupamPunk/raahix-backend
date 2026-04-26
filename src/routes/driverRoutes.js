const express = require('express');
const router = express.Router();
const DriverService = require('../services/DriverService');

/**
 * POST /driver/verify-otp
 * Handles demo OTP verification for the Flutter driver app.
 */
router.post('/verify-otp', async (req, res) => {
    // 1. Logging incoming request for debugging
    console.log('--- [INCOMING REQUEST: /driver/verify-otp] ---');
    console.log('Body:', req.body);

    try {
        const { mobile_number, otp, dev_bypass } = req.body;

        // 2. Validate input
        if (!mobile_number || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number and OTP are required'
            });
        }

        // 3. Call DriverService for verification
        // This will check for fixed OTP "123456" via OTPService
        const result = await DriverService.verifyDriverLogin(mobile_number, otp, dev_bypass);

        // 4. Return success response exactly as requested
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: result.token,
            driver: result.driver
        });

    } catch (error) {
        // 5. Error Handling
        console.error('--- [LOGIN ERROR] ---');
        console.error(error.message);

        return res.status(401).json({
            success: false,
            message: error.message === 'Invalid OTP' ? 'Invalid OTP' : error.message
        });
    }
});

module.exports = router;
