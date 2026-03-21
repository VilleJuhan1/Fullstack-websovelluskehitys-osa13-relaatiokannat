const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

/*
 Column |  Type   | Collation | Nullable |              Default              
--------+---------+-----------+----------+-----------------------------------
 id     | integer |           | not null | nextval('blogs_id_seq'::regclass)
 author | text    |           |          | 
 url    | text    |           | not null | 
 title  | text    |           | not null | 
 likes  | integer |           |          | 0
*/

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year_written: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: 1991,
        msg: 'Year must be 1991 or later'
      },
      max: {
        args: new Date().getFullYear(),
        msg: `Year cannot be in the future`
      },
      isInt: {
        msg: 'Year must be an integer'
      }
    }
  }
},
{
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'blog'
})

module.exports = Blog