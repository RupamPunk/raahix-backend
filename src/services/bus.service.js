const BusModel = require('../models/bus.model');

class BusService {
    static async createBus(admin_id, data) {
        if (!data.bus_number || !data.bus_code || !data.capacity || !data.type) {
            throw { status: 400, message: 'All bus fields are required' };
        }
        return await BusModel.create({ admin_id, ...data });
    }

    static async getBuses(admin_id) {
        return await BusModel.findAll(admin_id);
    }

    static async getBusById(id, admin_id) {
        const bus = await BusModel.findById(id, admin_id);
        if (!bus) throw { status: 404, message: 'Bus not found' };
        return bus;
    }

    static async updateBus(id, admin_id, data) {
        const bus = await BusModel.update(id, admin_id, data);
        if (!bus) throw { status: 404, message: 'Bus not found or unauthorized' };
        return bus;
    }

    static async deleteBus(id, admin_id) {
        const deleted = await BusModel.delete(id, admin_id);
        if (!deleted) throw { status: 404, message: 'Bus not found or unauthorized' };
        return { message: 'Bus deleted successfully' };
    }
}

module.exports = BusService;
