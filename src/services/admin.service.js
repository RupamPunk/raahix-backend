const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/admin.model');

class AdminService {
    static async register(data) {
        // Only extract columns that exist in the admins table.
        // bus_code_number / service_type from the frontend are intentionally
        // ignored here — those columns do NOT exist in the admins table.
        const { name, phone, email, password, admin_type, u_id, school_name, city } = data;

        // Basic validation
        if (!name || !phone || !email || !password || !admin_type) {
            throw { status: 400, message: 'Missing required fields' };
        }

        if (admin_type === 'school' && (!u_id || !school_name)) {
            throw { status: 400, message: 'u_id and school_name are required for school admin type' };
        }

        if (admin_type === 'public' && !city) {
            throw { status: 400, message: 'city is required for public admin type' };
        }

        // Check if admin already exists
        const existingAdmin = await AdminModel.findByPhoneOrEmail(email);
        if (existingAdmin) {
            throw { status: 400, message: 'Email or phone already linked to an account' };
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save — only pass columns that exist in DB
        const newAdmin = await AdminModel.create({
            name, phone, email,
            password: hashedPassword,
            admin_type,
            u_id: u_id || null,
            school_name: school_name || null,
            city: city || null
        });

        return newAdmin;
    }


    static async login(emailOrPhone, password) {
        if (!emailOrPhone || !password) {
            throw { status: 400, message: 'Please provide email/phone and password' };
        }

        const admin = await AdminModel.findByPhoneOrEmail(emailOrPhone);
        if (!admin) {
            throw { status: 401, message: 'Invalid credentials' };
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            throw { status: 401, message: 'Invalid credentials' };
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, admin_type: admin.admin_type },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                admin_type: admin.admin_type
            }
        };
    }

    static async getProfile(adminId) {
        const admin = await AdminModel.findById(adminId);
        if (!admin) {
            throw { status: 404, message: 'Admin profile not found' };
        }
        return admin;
    }
}

module.exports = AdminService;
