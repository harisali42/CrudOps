const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeacherCourse = sequelize.define('TeacherCourse', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teachers',
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
  tableName: 'teacher_courses',
  timestamps: true,
});

module.exports = TeacherCourse;
