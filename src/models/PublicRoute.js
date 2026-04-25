// src/models/PublicRoute.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PublicRoute = sequelize.define('PublicRoute', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  route_name: DataTypes.STRING,
  origin: DataTypes.STRING,
  destination: DataTypes.STRING,
  distance: DataTypes.FLOAT,
  duration: DataTypes.INTEGER,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = PublicRoute;
