// module.exports = (sequelize, DataTypes) => {};

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  isValid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

}, {
  tableName: 'sessions',
  timestamps: true,
});

module.exports = Session;
