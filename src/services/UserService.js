// src/services/UserService.js
const { Op } = require('sequelize');
const User = require('../models/User');
const Organization = require('../models/Organization');
const SchoolAccess = require('../models/SchoolAccess');
const Bus = require('../models/Bus');
const LiveLocation = require('../models/LiveLocation');
const PublicRoute = require('../models/PublicRoute');
const { generateOTP, sendOTP, verifyOTP } = require('./OTPService');

class UserService {
    
    // Register new user (Parent or Public)
    static async registerUser(userData) {
        const { full_name, phone_number, email, password, user_type, unique_id } = userData;
        
        // Check if user already exists
        const existingUser = await User.findOne({
            where: { [Op.or]: [{ phone_number }, { email }] }
        });
        
        if (existingUser) {
            throw new Error('User already exists with this phone number or email');
        }
        
        // Hash password if provided
        let passwordHash = null;
        if (password) {
            passwordHash = await bcrypt.hash(password, 12);
        }
        
        // Create user
        const user = await User.create({
            full_name,
            phone_number,
            email,
            password_hash: passwordHash,
            user_type: user_type || 'public',
            unique_id: unique_id || null,
            is_verified: true
        });
        
        return {
            success: true,
            user_id: user.id,
            message: 'User registered successfully'
        };
    }
    
    // Send OTP for user login
    static async sendUserLoginOTP(phoneNumber) {
        const user = await User.findOne({
            where: { phone_number: phoneNumber, is_active: true }
        });
        
        if (!user) {
            // Auto-register for new users (optional)
            // throw new Error('User not found');
            
            // Or auto-create user
            const newUser = await User.create({
                full_name: 'User',
                phone_number: phoneNumber,
                user_type: 'public',
                is_verified: true
            });
            
            const otp = await generateOTP(phoneNumber, 'user');
            await sendOTP(phoneNumber, otp);
            
            return {
                success: true,
                message: 'OTP sent successfully',
                is_new_user: true,
                user_id: newUser.id
            };
        }
        
        const otp = await generateOTP(phoneNumber, 'user');
        await sendOTP(phoneNumber, otp);
        
        return {
            success: true,
            message: 'OTP sent successfully',
            user_id: user.id
        };
    }
    
    // Verify OTP and login user
    static async verifyUserLogin(phoneNumber, otp) {
        const isValid = await verifyOTP(phoneNumber, otp, 'user');
        
        if (!isValid) {
            throw new Error('Invalid or expired OTP');
        }
        
        const user = await User.findOne({
            where: { phone_number: phoneNumber, is_active: true }
        });
        
        if (!user) {
            throw new Error('User not found');
        }
        
        const token = jwt.sign(
            {
                user_id: user.id,
                phone: user.phone_number,
                type: user.user_type
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
        
        return {
            success: true,
            token,
            user: {
                id: user.id,
                name: user.full_name,
                phone: user.phone_number,
                email: user.email,
                type: user.user_type
            }
        };
    }
    
    // My Child's Bus Feature - Enter School U-ID
    static async addSchoolAccess(userId, schoolUniqueCode, childName) {
        // Find organization by unique code
        const organization = await Organization.findOne({
            where: { unique_code: schoolUniqueCode, org_type: 'school', is_active: true }
        });
        
        if (!organization) {
            throw new Error('Invalid U-ID. Please check and try again.');
        }
        
        // Check if already added
        const existing = await SchoolAccess.findOne({
            where: { user_id: userId, organization_id: organization.id }
        });
        
        if (existing) {
            throw new Error('School already added to your account');
        }
        
        // Add school access
        const schoolAccess = await SchoolAccess.create({
            user_id: userId,
            organization_id: organization.id,
            school_unique_code: schoolUniqueCode,
            child_name: childName,
            verified_at: new Date()
        });
        
        // Update user type to 'both' or 'parent'
        await User.update(
            { user_type: userId.user_type === 'public' ? 'both' : 'parent' },
            { where: { id: userId } }
        );
        
        // Get buses for this school
        const buses = await Bus.findAll({
            where: { organization_id: organization.id, is_active: true },
            include: [{
                model: LiveLocation,
                as: 'live_location',
                limit: 1,
                order: [['recorded_at', 'DESC']]
            }]
        });
        
        return {
            success: true,
            message: `Successfully linked to ${organization.name}`,
            organization: {
                id: organization.id,
                name: organization.name,
                branch: organization.branch_name,
                unique_code: organization.unique_code
            },
            buses: buses.map(bus => ({
                id: bus.id,
                bus_code: bus.bus_code_number,
                license: bus.license_plate_number,
                live_location: bus.live_location
            }))
        };
    }
    
    // Get user's tracked schools and buses (My Child's Bus)
    static async getUserTrackedBuses(userId) {
        const schoolAccesses = await SchoolAccess.findAll({
            where: { user_id: userId, is_active: true },
            include: [{
                model: Organization,
                as: 'organization',
                where: { is_active: true }
            }]
        });
        
        const result = [];
        
        for (const access of schoolAccesses) {
            const buses = await Bus.findAll({
                where: { organization_id: access.organization_id, is_active: true },
                include: [{
                    model: LiveLocation,
                    as: 'live_location',
                    limit: 1,
                    order: [['recorded_at', 'DESC']]
                }, {
                    model: Trip,
                    as: 'active_trip',
                    where: { status: 'active' },
                    required: false,
                    limit: 1
                }]
            });
            
            result.push({
                organization: {
                    id: access.organization_id,
                    name: access.organization.name,
                    unique_code: access.school_unique_code
                },
                child_name: access.child_name,
                buses: buses.map(bus => ({
                    id: bus.id,
                    bus_code: bus.bus_code_number,
                    eta: bus.active_trip ? this.calculateETA(bus.live_location) : null,
                    student_count: bus.live_location?.student_count || 0,
                    live_location: bus.live_location
                }))
            });
        }
        
        return result;
    }
    
    // Public Transport - Search Buses
    static async searchPublicBuses(fromLocation, toLocation) {
        // Find routes between locations
        const routes = await PublicRoute.findAll({
            where: {
                from_location: { [Op.iLike]: `%${fromLocation}%` },
                to_location: { [Op.iLike]: `%${toLocation}%` },
                is_active: true
            }
        });
        
        const results = [];
        
        for (const route of routes) {
            // Find buses assigned to this route
            const busRoutes = await BusRoute.findAll({
                where: { route_id: route.id },
                include: [{
                    model: Bus,
                    as: 'bus',
                    where: { is_active: true },
                    include: [{
                        model: LiveLocation,
                        as: 'live_location',
                        limit: 1,
                        order: [['recorded_at', 'DESC']]
                    }, {
                        model: Organization,
                        as: 'organization',
                        where: { org_type: 'public_transport' }
                    }]
                }]
            });
            
            for (const busRoute of busRoutes) {
                if (busRoute.bus && busRoute.bus.live_location) {
                    results.push({
                        route_number: route.route_number,
                        route_name: route.route_name,
                        estimated_duration: route.estimated_duration,
                        bus: {
                            id: busRoute.bus.id,
                            bus_code: busRoute.bus.bus_code_number,
                            license: busRoute.bus.license_plate_number
                        },
                        eta_minutes: this.calculateETAFromLocation(busRoute.bus.live_location),
                        live_location: busRoute.bus.live_location
                    });
                }
            }
        }
        
        return results;
    }
    
    // Calculate ETA (Estimated Time of Arrival)
    static calculateETA(liveLocation) {
        if (!liveLocation) return null;
        
        // Simple ETA calculation based on distance and speed
        // In production, use Google Maps Distance Matrix API
        const distanceToDestination = 5; // km (example)
        const speed = liveLocation.speed || 30; // km/h
        
        if (speed > 0) {
            const etaMinutes = (distanceToDestination / speed) * 60;
            return Math.round(etaMinutes);
        }
        
        return null;
    }
    
    static calculateETAFromLocation(liveLocation) {
        return this.calculateETA(liveLocation);
    }
}

module.exports = UserService;