const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Username must not be empty'
      },
      isEmail: {
          msg: 'Username must be a valid email address'
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name must not be empty'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password must not be empty'
      }
    }
  },
  has_access: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
},  
  {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

module.exports = User