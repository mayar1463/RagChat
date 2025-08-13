const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false
});

const Session = require('./session.model')(sequelize, DataTypes);
const Message = require('./message.model')(sequelize, DataTypes);

// Define associations
Session.hasMany(Message, { foreignKey: 'session_id', onDelete: 'CASCADE' });
Message.belongsTo(Session, { foreignKey: 'session_id' });

module.exports = sequelize;