const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { ATTENDANCE_STATUS } = require('../constants/enums');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  attendanceDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM(...Object.values(ATTENDANCE_STATUS)),
    allowNull: false,
  },

  markedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

}, {
  tableName: 'attendances',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['classId', 'studentId', 'attendanceDate'],
    }
  ],
});

module.exports = Attendance;
