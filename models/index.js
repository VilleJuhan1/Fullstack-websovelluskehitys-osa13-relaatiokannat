const Blog = require('./blog')
const User = require('./user')
const UserReadingList = require('./userReadingList')
const Session = require('./session')

// The "main" tables for users and blogs
User.hasMany(Blog, { foreignKey: 'user_id' })
Blog.belongsTo(User, { foreignKey: 'user_id' })

// Reading list relations to users and blogs
User.belongsToMany(Blog, {
  as: 'readings',
  through: UserReadingList,
  foreignKey: 'user_id'
})

Blog.belongsToMany(User, {
  as: 'readers',
  through: UserReadingList,
  foreignKey: 'blog_id'
})

// Sessions that relate to individual users
Session.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Session, { foreignKey: 'user_id' })

module.exports = {
  Blog,
  User,
  UserReadingList,
  Session
}