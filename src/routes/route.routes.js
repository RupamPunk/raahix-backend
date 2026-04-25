const express = require('express');
const router = express.Router();
const RouteController = require('../controllers/route.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.use(requireAuth);

router.post('/', RouteController.createRoute);
router.get('/', RouteController.getRoutes);
router.get('/:id', RouteController.getRouteById);
router.put('/:id', RouteController.updateRoute);
router.delete('/:id', RouteController.deleteRoute);

module.exports = router;
