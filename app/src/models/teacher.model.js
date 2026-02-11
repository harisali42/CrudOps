// models/teacher.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // one user = one teacher profile
  },

  employeeId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },

  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

}, {
  tableName: 'teachers',
  timestamps: true,
  paranoid: true,
});

module.exports = Teacher;
