const express = require('express');
const router = express.Router();
const BusController = require('../controllers/bus.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.use(requireAuth);

router.post('/', BusController.createBus);
router.get('/', BusController.getBuses);
router.get('/:id', BusController.getBusById);
router.put('/:id', BusController.updateBus);
router.delete('/:id', BusController.deleteBus);

module.exports = router;
