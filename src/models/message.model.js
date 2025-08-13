module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sessions',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    sender: {
      type: DataTypes.ENUM('user', 'assistant'),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    context: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'messages',
    indexes: [
      {
        fields: ['session_id']
      }
    ],
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false // Only createdAt is needed for messages
  });

  return Message;
};