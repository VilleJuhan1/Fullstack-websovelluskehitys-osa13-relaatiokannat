const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class UserReadingList extends Model {}

// The model for reading_list table that contains the blogs user has added to their reading list
UserReadingList.init({
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
  blog_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'blogs',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},
{
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'reading_list',
  tableName: 'reading_list',
  freezeTableName: true
})

module.exports = UserReadingList