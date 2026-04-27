const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { verifyOTP } = require('../services/OTPService');

const DEMO_OTP = '123456';

exports.verifyDriverLogin = async (req, res) => {
    console.log('--- [INCOMING REQUEST: /driver/verify-otp] ---');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Body:', req.body);

    try {
        const mobileNumber = req.body.mobile_number != null
            ? String(req.body.mobile_number).trim()
            : '';
        const otp = req.body.otp != null
            ? String(req.body.otp).trim()
            : '';
        const devBypass = req.body.dev_bypass === true || req.body.dev_bypass === 'true';

        if (!mobileNumber || !otp) {
            return res.status(400).json({
                success: false,
                message: 'mobile_number and otp are required'
            });
        }

        const isValidOtp = verifyOTP(mobileNumber, otp, 'driver', devBypass);
        if (!isValidOtp) {
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP. Use 123456 or set dev_bypass to true.'
            });
        }

        // TEMP: Return dummy driver data (no DB dependency)
        const dummyDriver = {
            id: 'dummy-uuid-123',
            driver_name: 'Demo Driver',
            mobile_number: mobileNumber,
            bus_id: 'dummy-bus-uuid',
            organization_id: 'dummy-org-uuid'
        };

        const token = jwt.sign(
            {
                driver_id: dummyDriver.id,
                mobile: dummyDriver.mobile_number,
                role: 'driver',
                bus_id: dummyDriver.bus_id,
                organization_id: dummyDriver.organization_id
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '12h' }
        );

        console.log(`✅ Driver logged in: ${dummyDriver.driver_name} (${dummyDriver.mobile_number})`);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            driver: {
                id: dummyDriver.id,
                name: dummyDriver.driver_name,
                mobile: dummyDriver.mobile_number,
                bus_id: dummyDriver.bus_id,
                bus: null // No bus data for demo
            }
        });
    } catch (error) {
        console.error('--- [ERROR] /driver/verify-otp ---');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong. Please try again.'
        });
    }
};
