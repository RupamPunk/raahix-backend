// src/routes/v1/driver.js
const express = require('express');
const router = express.Router();
const DriverService = require('../../services/DriverService');
const { authenticateDriver } = require('../../middlewares/auth');

// Driver Login with OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { mobile_number } = req.body;
        const result = await DriverService.sendDriverLoginOTP(mobile_number);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { mobile_number, otp, dev_bypass } = req.body;
        const result = await DriverService.verifyDriverLogin(mobile_number, otp, dev_bypass);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Protected routes (require authentication)
router.use(authenticateDriver);

router.post('/trip/start', async (req, res) => {
    try {
        const { bus_id, route_name } = req.body;
        const result = await DriverService.startTrip(req.driver.id, bus_id, route_name);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/trip/location', async (req, res) => {
    try {
        const { trip_id, bus_id, latitude, longitude, speed, heading, student_count } = req.body;
        const result = await DriverService.updateLiveLocation(
            req.driver.id, trip_id, bus_id,
            { latitude, longitude, speed, heading, studentCount: student_count }
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/trip/end', async (req, res) => {
    try {
        const { trip_id } = req.body;
        const result = await DriverService.endTrip(req.driver.id, trip_id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/students', async (req, res) => {
    try {
        const { bus_id, trip_id } = req.query;
        const students = await DriverService.getStudentsOnBoard(bus_id, trip_id);
        res.json({ success: true, students });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/trips', async (req, res) => {
    try {
        const { driver_id } = req.query;
        const trips = await DriverService.getDriverTrips(driver_id);
        res.json({ success: true, trips });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;