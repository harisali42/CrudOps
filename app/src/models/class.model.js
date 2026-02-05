const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING(100), // e.g., "Grade 10-A"
    allowNull: false,
  },

  roomNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },

  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },

}, {
  tableName: 'classes',
  timestamps: true,
  paranoid: true,
});

module.exports = Class;
