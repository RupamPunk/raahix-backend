const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { verifyOTP } = require('../services/OTPService');

/**
 * POST /driver/verify-otp
 * Demo OTP verification for the Flutter driver app.
 * Uses raw pg pool queries to avoid Sequelize association issues.
 */
router.post('/verify-otp', async (req, res) => {
    console.log('--- [INCOMING REQUEST: /driver/verify-otp] ---');
    console.log('Body:', req.body);

    try {
        const { mobile_number, otp, dev_bypass } = req.body;

        // 1. Validate input
        if (!mobile_number || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number and OTP are required'
            });
        }

        // 2. Verify OTP (demo: accepts "123456" or dev_bypass: true)
        const isValid = verifyOTP(mobile_number, otp, 'driver', dev_bypass);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // 3. Look up driver using raw SQL (avoids Sequelize association issues)
        const driverResult = await pool.query(
            `SELECT 
                d.id, d.driver_name, d.mobile_number, d.bus_id, d.organization_id,
                b.bus_number, b.license_plate, b.capacity, b.status AS bus_status
             FROM drivers d
             LEFT JOIN buses b ON b.id = d.bus_id
             WHERE d.mobile_number = $1 AND d.is_active = true
             LIMIT 1`,
            [mobile_number]
        );

        if (driverResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found. Mobile number not registered.'
            });
        }

        const driver = driverResult.rows[0];

        // 4. Generate JWT token
        const token = jwt.sign(
            {
                driver_id: driver.id,
                mobile: driver.mobile_number,
                role: 'driver',
                bus_id: driver.bus_id,
                organization_id: driver.organization_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        // 5. Update last login timestamp
        await pool.query(
            `UPDATE drivers SET updated_at = NOW() WHERE id = $1`,
            [driver.id]
        );

        console.log(`✅ Driver logged in: ${driver.driver_name} (${driver.mobile_number})`);

        // 6. Return success response
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            driver: {
                id: driver.id,
                name: driver.driver_name,
                mobile: driver.mobile_number,
                bus_id: driver.bus_id,
                bus: driver.bus_id ? {
                    bus_number: driver.bus_number,
                    license_plate: driver.license_plate,
                    capacity: driver.capacity,
                    status: driver.bus_status
                } : null
            }
        });

    } catch (error) {
        console.error('--- [LOGIN ERROR] ---');
        console.error(error.message);

        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
});

module.exports = router;
