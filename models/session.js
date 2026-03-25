const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  has_access: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
},
{
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'sessions',
  tableName: 'sessions',
  freezeTableName: true
})

module.exports = Session