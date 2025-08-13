module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'sessions',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'title']
      },
      {
        fields: ['user_id']
      }
    ],
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Session;
};