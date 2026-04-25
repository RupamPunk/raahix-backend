const DriverModel = require('../models/driver.model');

class DriverService {
    static async createDriver(admin_id, data) {
        if (!data.name || !data.phone || !data.license_no) {
            throw { status: 400, message: 'All driver fields are required' };
        }
        return await DriverModel.create({ admin_id, ...data });
    }

    static async getDrivers(admin_id) {
        return await DriverModel.findAll(admin_id);
    }

    static async getDriverById(id, admin_id) {
        const driver = await DriverModel.findById(id, admin_id);
        if (!driver) throw { status: 404, message: 'Driver not found' };
        return driver;
    }

    static async updateDriver(id, admin_id, data) {
        const driver = await DriverModel.update(id, admin_id, data);
        if (!driver) throw { status: 404, message: 'Driver not found or unauthorized' };
        return driver;
    }

    static async deleteDriver(id, admin_id) {
        const deleted = await DriverModel.delete(id, admin_id);
        if (!deleted) throw { status: 404, message: 'Driver not found or unauthorized' };
        return { message: 'Driver deleted successfully' };
    }
}

module.exports = DriverService;
