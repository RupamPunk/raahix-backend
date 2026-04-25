// src/models/Organization.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Organization;
