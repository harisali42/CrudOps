const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

}, {
  tableName: 'departments',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['code'] },
  ],
});

module.exports = Department;
