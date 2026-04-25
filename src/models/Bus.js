// src/models/Bus.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Bus = sequelize.define('Bus', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  bus_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  license_plate: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  model: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('active', 'maintenance', 'inactive'),
    defaultValue: 'active'
  },
  driver_name: DataTypes.STRING,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Bus;
