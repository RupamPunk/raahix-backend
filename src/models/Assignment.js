// src/models/Assignment.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  bus_id: DataTypes.UUID,
  route_id: DataTypes.UUID,
  departure_time: DataTypes.TIME,
  arrival_time: DataTypes.TIME,
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  timestamps: true
});

module.exports = Assignment;
