// module.exports = (sequelize, DataTypes) => {};
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },

  description: {
    type: DataTypes.STRING(255),
  },

}, {
  tableName: 'roles',
  timestamps: true,
});

module.exports = Role;

