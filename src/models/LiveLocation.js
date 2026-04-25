// src/models/LiveLocation.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LiveLocation = sequelize.define('LiveLocation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  trip_id: DataTypes.UUID,
  bus_id: DataTypes.UUID,
  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT,
  speed: DataTypes.FLOAT,
  heading: DataTypes.FLOAT,
  student_count: DataTypes.INTEGER,
  timestamp: DataTypes.DATE
}, {
  timestamps: true
});

module.exports = LiveLocation;
