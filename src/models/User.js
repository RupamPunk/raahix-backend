// src/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = User;
