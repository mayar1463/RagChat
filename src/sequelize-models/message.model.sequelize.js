// src/sequelize-models/message.model.sequelize.js
const { DataTypes } = require('sequelize');
const sequelize = require('../models/db');
const Session = require('./session.model.sequelize');
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  session_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Session,
      key: 'id',
    },
  },
  sender: {
    type: DataTypes.ENUM('user', 'assistant'),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  context: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});
Session.hasMany(Message, { foreignKey: 'session_id', onDelete: 'CASCADE' });
Message.belongsTo(Session, { foreignKey: 'session_id' });
module.exports = Message;