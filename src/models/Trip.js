// src/models/Trip.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  driver_id: { type: DataTypes.UUID, allowNull: false },
  bus_id:    { type: DataTypes.UUID },
  route_name: { type: DataTypes.STRING },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active'
  },
  actual_start_time: { type: DataTypes.DATE },
  actual_end_time:   { type: DataTypes.DATE },
  student_count: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'trips',
  timestamps: true,
  underscored: true
});

module.exports = Trip;
