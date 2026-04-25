const AssignmentModel = require('../models/assignment.model');

class AssignmentService {
    static async createAssignment(admin_id, data) {
        if (!data.bus_id || !data.driver_id || !data.route_id) {
            throw { status: 400, message: 'Bus, Driver, and Route are all required for an assignment' };
        }
        return await AssignmentModel.create({ admin_id, ...data });
    }

    static async getAssignments(admin_id) {
        return await AssignmentModel.findAll(admin_id);
    }

    static async getAssignmentById(id, admin_id) {
        const assignment = await AssignmentModel.findById(id, admin_id);
        if (!assignment) throw { status: 404, message: 'Assignment not found' };
        return assignment;
    }

    static async updateAssignment(id, admin_id, data) {
        const assignment = await AssignmentModel.update(id, admin_id, data);
        if (!assignment) throw { status: 404, message: 'Assignment not found or unauthorized' };
        return assignment;
    }

    static async deleteAssignment(id, admin_id) {
        const deleted = await AssignmentModel.delete(id, admin_id);
        if (!deleted) throw { status: 404, message: 'Assignment not found or unauthorized' };
        return { message: 'Assignment deleted successfully' };
    }

    static async getLiveTracking(admin_id) {
        return await AssignmentModel.findLiveTracking(admin_id);
    }
}

module.exports = AssignmentService;
