const Blog = require('./blog')
const User = require('./user')
const UserReadingList = require('./userReadingList')

User.hasMany(Blog, { foreignKey: 'user_id' })
Blog.belongsTo(User, { foreignKey: 'user_id' })

Blog.belongsToMany(User, { through: UserReadingList, as: 'blogs_marked' })
User.belongsToMany(Blog, { through: UserReadingList, as: 'users_marking' })

// Moved to index.js to ensure proper synchronization of models
/*
Create the Blog table using the model if it doesn't exist already
User.sync({ alter: true })
Blog.sync({ alter: true })
*/

module.exports = {
  Blog,
  User,
  UserReadingList
}