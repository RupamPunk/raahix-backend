// src/models/SchoolAccess.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SchoolAccess = sequelize.define('SchoolAccess', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    organization_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    school_unique_code: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    child_name: {
        type: DataTypes.STRING(255)
    },
    relationship: {
        type: DataTypes.STRING(50),
        defaultValue: 'parent'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    verified_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'school_access',
    timestamps: true,
    underscored: true
});

module.exports = SchoolAccess;