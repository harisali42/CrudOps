// models/student.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // one user = one student profile
  },

  rollNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },

  admissionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  classId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

}, {
  tableName: 'students',
  timestamps: true,
  paranoid: true, // soft delete students
});

module.exports = Student;
