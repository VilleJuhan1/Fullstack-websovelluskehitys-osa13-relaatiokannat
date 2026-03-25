const Blog = require('./blog')
const User = require('./user')
const UserReadingList = require('./userReadingList')
const Session = require('./session')

User.hasMany(Blog, { foreignKey: 'user_id' })
Blog.belongsTo(User, { foreignKey: 'user_id' })

// Reading list (many-to-many)
User.belongsToMany(Blog, {
  as: 'readingList',
  through: UserReadingList,
  foreignKey: 'user_id'
})

Blog.belongsToMany(User, {
  as: 'readers',
  through: UserReadingList,
  foreignKey: 'blog_id'
})

Session.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Session, { foreignKey: 'user_id' })

module.exports = {
  Blog,
  User,
  UserReadingList,
  Session
}