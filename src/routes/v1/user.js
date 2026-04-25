// src/routes/v1/user.js
const express = require('express');
const router = express.Router();
const UserService = require('../../services/UserService');
const { authenticateUser } = require('../../middlewares/auth');

// User Registration
router.post('/register', async (req, res) => {
    try {
        const result = await UserService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// User Login with OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { phone_number } = req.body;
        const result = await UserService.sendUserLoginOTP(phone_number);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { phone_number, otp } = req.body;
        const result = await UserService.verifyUserLogin(phone_number, otp);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Protected routes
router.use(authenticateUser);

// My Child's Bus - Add School by U-ID
router.post('/school-access', async (req, res) => {
    try {
        const { school_unique_code, child_name } = req.body;
        const result = await UserService.addSchoolAccess(req.user.id, school_unique_code, child_name);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get tracked schools and buses
router.get('/tracked-buses', async (req, res) => {
    try {
        const result = await UserService.getUserTrackedBuses(req.user.id);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Public Transport - Search buses
router.get('/public/search', async (req, res) => {
    try {
        const { from, to } = req.query;
        const results = await UserService.searchPublicBuses(from, to);
        res.json({ success: true, results });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;