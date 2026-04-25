const AssignmentService = require('../services/assignment.service');

exports.createAssignment = async (req, res, next) => {
    try {
        const assignment = await AssignmentService.createAssignment(req.admin.id, req.body);
        res.status(201).json({ success: true, data: assignment });
    } catch (err) { next(err); }
};

exports.getAssignments = async (req, res, next) => {
    try {
        const assignments = await AssignmentService.getAssignments(req.admin.id);
        res.status(200).json({ success: true, data: assignments });
    } catch (err) { next(err); }
};

exports.getAssignmentById = async (req, res, next) => {
    try {
        const assignment = await AssignmentService.getAssignmentById(req.params.id, req.admin.id);
        res.status(200).json({ success: true, data: assignment });
    } catch (err) { next(err); }
};

exports.updateAssignment = async (req, res, next) => {
    try {
        const assignment = await AssignmentService.updateAssignment(req.params.id, req.admin.id, req.body);
        res.status(200).json({ success: true, data: assignment });
    } catch (err) { next(err); }
};

exports.deleteAssignment = async (req, res, next) => {
    try {
        const result = await AssignmentService.deleteAssignment(req.params.id, req.admin.id);
        res.status(200).json({ success: true, ...result });
    } catch (err) { next(err); }
};

exports.getLiveTracking = async (req, res, next) => {
    try {
        const tracking = await AssignmentService.getLiveTracking(req.admin.id);
        res.status(200).json({ success: true, data: tracking });
    } catch (err) { next(err); }
};
