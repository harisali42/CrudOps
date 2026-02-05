const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  conversationId: {
    type: DataTypes.STRING(36),
    allowNull: false,
    index: true,
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  messageType: {
    type: DataTypes.ENUM('text', 'file', 'system'),
    defaultValue: 'text',
  },

  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  messageId: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    allowNull: false,
    unique: true,
  },

}, {
  tableName: 'messages',
  timestamps: true,
  indexes: [
    {
      fields: ['conversationId', 'createdAt'],
    },
    {
      fields: ['senderId', 'receiverId'],
    },
  ],
});

module.exports = Message;
