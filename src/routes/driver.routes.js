const express = require('express');
const router = express.Router();
const DriverController = require('../controllers/driver.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.use(requireAuth);

router.post('/', DriverController.createDriver);
router.get('/', DriverController.getDrivers);
router.get('/:id', DriverController.getDriverById);
router.put('/:id', DriverController.updateDriver);
router.delete('/:id', DriverController.deleteDriver);

module.exports = router;
