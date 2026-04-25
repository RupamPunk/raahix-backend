const RouteService = require('../services/route.service');

exports.createRoute = async (req, res, next) => {
    try {
        const route = await RouteService.createRoute(req.admin.id, req.body);
        res.status(201).json({ success: true, data: route });
    } catch (err) { next(err); }
};

exports.getRoutes = async (req, res, next) => {
    try {
        const routes = await RouteService.getRoutes(req.admin.id);
        res.status(200).json({ success: true, data: routes });
    } catch (err) { next(err); }
};

exports.getRouteById = async (req, res, next) => {
    try {
        const route = await RouteService.getRouteById(req.params.id, req.admin.id);
        res.status(200).json({ success: true, data: route });
    } catch (err) { next(err); }
};

exports.updateRoute = async (req, res, next) => {
    try {
        const route = await RouteService.updateRoute(req.params.id, req.admin.id, req.body);
        res.status(200).json({ success: true, data: route });
    } catch (err) { next(err); }
};

exports.deleteRoute = async (req, res, next) => {
    try {
        const result = await RouteService.deleteRoute(req.params.id, req.admin.id);
        res.status(200).json({ success: true, ...result });
    } catch (err) { next(err); }
};
