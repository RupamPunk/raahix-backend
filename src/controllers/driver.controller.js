const DriverService = require('../services/driver.service');

exports.createDriver = async (req, res, next) => {
    try {
        const driver = await DriverService.createDriver(req.admin.id, req.body);
        res.status(201).json({ success: true, data: driver });
    } catch (err) { next(err); }
};

exports.getDrivers = async (req, res, next) => {
    try {
        const drivers = await DriverService.getDrivers(req.admin.id);
        res.status(200).json({ success: true, data: drivers });
    } catch (err) { next(err); }
};

exports.getDriverById = async (req, res, next) => {
    try {
        const driver = await DriverService.getDriverById(req.params.id, req.admin.id);
        res.status(200).json({ success: true, data: driver });
    } catch (err) { next(err); }
};

exports.updateDriver = async (req, res, next) => {
    try {
        const driver = await DriverService.updateDriver(req.params.id, req.admin.id, req.body);
        res.status(200).json({ success: true, data: driver });
    } catch (err) { next(err); }
};

exports.deleteDriver = async (req, res, next) => {
    try {
        const result = await DriverService.deleteDriver(req.params.id, req.admin.id);
        res.status(200).json({ success: true, ...result });
    } catch (err) { next(err); }
};
