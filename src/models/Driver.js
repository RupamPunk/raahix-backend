// src/models/Driver.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Driver = sequelize.define('Driver', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    organization_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    bus_id: {
        type: DataTypes.UUID
    },
    driver_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    mobile_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(255)
    },
    license_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    license_document_url: {
        type: DataTypes.TEXT
    },
    experience_years: {
        type: DataTypes.DECIMAL(3, 1)
    },
    emergency_contact: {
        type: DataTypes.STRING(20)
    },
    status: {
        type: DataTypes.ENUM('available', 'on_duty', 'off_duty', 'suspended'),
        defaultValue: 'available'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'drivers',
    timestamps: true,
    underscored: true
});

module.exports = Driver;