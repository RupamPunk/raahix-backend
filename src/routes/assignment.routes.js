const express = require('express');
const router = express.Router();
const AssignmentController = require('../controllers/assignment.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.use(requireAuth);

router.get('/live-tracking', AssignmentController.getLiveTracking);
router.post('/', AssignmentController.createAssignment);
router.get('/', AssignmentController.getAssignments);
router.get('/:id', AssignmentController.getAssignmentById);
router.put('/:id', AssignmentController.updateAssignment);
router.delete('/:id', AssignmentController.deleteAssignment);

module.exports = router;
