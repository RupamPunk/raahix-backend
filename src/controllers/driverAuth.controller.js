const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { verifyOTP } = require('../services/OTPService');

const DEMO_OTP = '123456';

exports.verifyDriverLogin = async (req, res) => {
    console.log('--- [INCOMING REQUEST: /driver/verify-otp] ---');
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

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured.');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error. Please contact support.'
            });
        }

        const sql = `
            SELECT
                d.id, d.driver_name, d.mobile_number, d.bus_id, d.organization_id,
                b.bus_number, b.license_plate, b.capacity, b.status AS bus_status
            FROM drivers d
            LEFT JOIN buses b ON b.id = d.bus_id
            WHERE d.mobile_number = $1 AND d.is_active = true
            LIMIT 1
        `;

        const { rows } = await pool.query(sql, [mobileNumber]);

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found. mobile_number is not registered or inactive.'
            });
        }

        const driver = rows[0];

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

        await pool.query(
            `UPDATE drivers SET updated_at = NOW() WHERE id = $1`,
            [driver.id]
        );

        console.log(`✅ Driver logged in: ${driver.driver_name} (${driver.mobile_number})`);

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
        console.error('--- [ERROR] /driver/verify-otp ---');
        console.error(error.stack || error);

        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
};
