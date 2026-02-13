const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserRole = sequelize.define('UserRole', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },

}, {
  tableName: 'user_roles',
  timestamps: true,
  paranoid: true,
});

module.exports = UserRole;

