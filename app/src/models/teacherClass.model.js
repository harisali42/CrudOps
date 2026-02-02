const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeacherClass = sequelize.define('TeacherClass', {
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

  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id',
    },
  },

}, {
  tableName: 'teacher_classes',
  timestamps: true,
});

module.exports = TeacherClass;
