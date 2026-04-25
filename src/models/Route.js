// src/models/Route.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  route_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  origin: DataTypes.STRING,
  destination: DataTypes.STRING,
  stops: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  timestamps: true
});

module.exports = Route;
