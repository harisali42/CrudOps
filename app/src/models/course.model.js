const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING(100), // e.g., "Mathematics"
    allowNull: false,
    unique: true,
  },

  code: {
    type: DataTypes.STRING(20), // e.g., "MATH101"
    allowNull: false,
    unique: true,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  credits: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
  },

}, {
  tableName: 'courses',
  timestamps: true,
  paranoid: true,
});

module.exports = Course;
