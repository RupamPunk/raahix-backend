const RouteModel = require('../models/route.model');

class RouteService {
    static async createRoute(admin_id, data) {
        if (!data.name) {
            throw { status: 400, message: 'Route name is required' };
        }
        return await RouteModel.create({ admin_id, ...data });
    }

    static async getRoutes(admin_id) {
        return await RouteModel.findAll(admin_id);
    }

    static async getRouteById(id, admin_id) {
        const route = await RouteModel.findById(id, admin_id);
        if (!route) throw { status: 404, message: 'Route not found' };
        return route;
    }

    static async updateRoute(id, admin_id, data) {
        const route = await RouteModel.update(id, admin_id, data);
        if (!route) throw { status: 404, message: 'Route not found or unauthorized' };
        return route;
    }

    static async deleteRoute(id, admin_id) {
        const deleted = await RouteModel.delete(id, admin_id);
        if (!deleted) throw { status: 404, message: 'Route not found or unauthorized' };
        return { message: 'Route deleted successfully' };
    }
}

module.exports = RouteService;
