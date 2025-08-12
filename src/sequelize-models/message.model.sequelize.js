// src/models/message.model.js
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
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  context: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // Assuming messages don't get updated
});

// Define association
Session.hasMany(Message, { foreignKey: 'session_id', onDelete: 'CASCADE' });
Message.belongsTo(Session, { foreignKey: 'session_id' });

module.exports = Message;