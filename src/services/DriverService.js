// src/services/DriverService.js
const { Op } = require('sequelize');
const Driver = require('../models/Driver');
const Bus = require('../models/Bus');
const Organization = require('../models/Organization');
const Trip = require('../models/Trip');
const LiveLocation = require('../models/LiveLocation');
const jwt = require('jsonwebtoken');
const { generateOTP, sendOTP, verifyOTP } = require('./OTPService');

class DriverService {
    
    // Send OTP to driver's mobile number
    static async sendDriverLoginOTP(mobileNumber) {
        // Check if driver exists
        const driver = await Driver.findOne({
            where: { mobile_number: mobileNumber, is_active: true },
            include: [{
                model: Bus,
                as: 'bus',
                include: [{
                    model: Organization,
                    as: 'organization'
                }]
            }]
        });
        
        if (!driver) {
            throw new Error('Invalid candidate. Mobile number not registered.');
        }
        
        // Generate and send OTP
        const otp = await generateOTP(mobileNumber, 'driver');
        await sendOTP(mobileNumber, otp);
        
        return {
            success: true,
            message: 'OTP sent successfully',
            driver_id: driver.id,
            driver_name: driver.driver_name
        };
    }
    
    // Verify OTP and login driver
    static async verifyDriverLogin(mobileNumber, otp, devBypass = false) {
        // Verify OTP (skip if devBypass is true)
        if (!devBypass) {
            const isValid = await verifyOTP(mobileNumber, otp, 'driver');
            if (!isValid) {
                throw new Error('Invalid or expired OTP');
            }
        }
        
        // Get driver details
        const driver = await Driver.findOne({
            where: { mobile_number: mobileNumber, is_active: true },
            include: [{
                model: Bus,
                as: 'bus',
                include: [{
                    model: Organization,
                    as: 'organization'
                }]
            }]
        });
        
        if (!driver) {
            throw new Error('Driver not found');
        }
        
        // Generate JWT token for driver
        const token = jwt.sign(
            {
                driver_id: driver.id,
                mobile: driver.mobile_number,
                role: 'driver',
                bus_id: driver.bus_id,
                organization_id: driver.organization_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );
        
        // Update last login
        await driver.update({ last_login_at: new Date() });
        
        return {
            success: true,
            token,
            driver: {
                id: driver.id,
                name: driver.driver_name,
                mobile: driver.mobile_number,
                bus_id: driver.bus_id,
                bus: driver.bus,
                organization: driver.bus?.organization
            }
        };
    }
    
    // Get driver trips history
    static async getDriverTrips(driverId) {
        const trips = await Trip.findAll({
            where: { driver_id: driverId },
            order: [['actual_start_time', 'DESC']],
            limit: 20
        });
        return trips;
    }
    
    // Start trip (driver begins route)
    static async startTrip(driverId, busId, routeName) {
        const driver = await Driver.findByPk(driverId);
        
        if (!driver) {
            throw new Error('Driver not found');
        }
        
        // Update driver status
        await driver.update({ status: 'on_duty' });
        
        // Create new trip
        const trip = await Trip.create({
            bus_id: busId,
            driver_id: driverId,
            actual_start_time: new Date(),
            status: 'active',
            route_name: routeName,
            student_count: 0
        });
        
        return {
            success: true,
            trip_id: trip.id,
            message: 'Trip started successfully'
        };
    }
    
    // Update live location (sent from driver app every few seconds)
    static async updateLiveLocation(driverId, tripId, busId, locationData) {
        const { latitude, longitude, speed, heading, studentCount } = locationData;
        
        // Save live location
        const liveLocation = await LiveLocation.create({
            bus_id: busId,
            trip_id: tripId,
            driver_id: driverId,
            latitude,
            longitude,
            speed: speed || 0,
            heading: heading || 0,
            student_count: studentCount || 0,
            recorded_at: new Date()
        });
        
        // Update trip student count if provided
        if (studentCount !== undefined) {
            await Trip.update(
                { student_count: studentCount },
                { where: { id: tripId } }
            );
        }
        
        return { success: true };
    }
    
    // End trip
    static async endTrip(driverId, tripId) {
        const trip = await Trip.findByPk(tripId);
        
        if (!trip) {
            throw new Error('Trip not found');
        }
        
        await trip.update({
            status: 'completed',
            actual_end_time: new Date()
        });
        
        // Update driver status back to available
        await Driver.update(
            { status: 'available' },
            { where: { id: driverId } }
        );
        
        return {
            success: true,
            message: 'Trip ended successfully'
        };
    }
    
    // Get students on board (Future Scope — Student model not yet implemented)
    static async getStudentsOnBoard(busId, tripId) {
        return [];
    }
}

module.exports = DriverService;