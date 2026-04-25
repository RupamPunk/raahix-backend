const AdminService = require('../services/admin.service');

exports.register = async (req, res, next) => {
    try {
        const admin = await AdminService.register(req.body);
        res.status(201).json({
            success: true,
            data: admin
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { emailOrPhone, password } = req.body;
        const result = await AdminService.login(emailOrPhone, password);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const profile = await AdminService.getProfile(req.admin.id);
        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (err) {
        next(err);
    }
};
