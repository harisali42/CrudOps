// module.exports = (sequelize, DataTypes) => {};
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserRole = sequelize.define('UserRole', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  roleId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

}, {
  tableName: 'user_roles',
  timestamps: false,
});

module.exports = UserRole;

