const BusService = require('../services/bus.service');

exports.createBus = async (req, res, next) => {
    try {
        const bus = await BusService.createBus(req.admin.id, req.body);
        res.status(201).json({ success: true, data: bus });
    } catch (err) { next(err); }
};

exports.getBuses = async (req, res, next) => {
    try {
        const buses = await BusService.getBuses(req.admin.id);
        res.status(200).json({ success: true, data: buses });
    } catch (err) { next(err); }
};

exports.getBusById = async (req, res, next) => {
    try {
        const bus = await BusService.getBusById(req.params.id, req.admin.id);
        res.status(200).json({ success: true, data: bus });
    } catch (err) { next(err); }
};

exports.updateBus = async (req, res, next) => {
    try {
        const bus = await BusService.updateBus(req.params.id, req.admin.id, req.body);
        res.status(200).json({ success: true, data: bus });
    } catch (err) { next(err); }
};

exports.deleteBus = async (req, res, next) => {
    try {
        const result = await BusService.deleteBus(req.params.id, req.admin.id);
        res.status(200).json({ success: true, ...result });
    } catch (err) { next(err); }
};
