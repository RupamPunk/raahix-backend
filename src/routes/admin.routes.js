const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.post('/register', AdminController.register);
router.post('/login', AdminController.login);
router.get('/profile', requireAuth, AdminController.getProfile);

module.exports = router;
