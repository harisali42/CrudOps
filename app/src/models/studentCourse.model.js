const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentCourse = sequelize.define('StudentCourse', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
  },

  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id',
    },
  },

}, {
  tableName: 'student_courses',
  timestamps: true,
});

module.exports = StudentCourse;
