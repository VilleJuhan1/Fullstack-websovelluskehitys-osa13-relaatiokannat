const Blog = require('./blog')
const User = require('./user')
const UserReadingList = require('./userReadingList')

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

/*
Blog.belongsToMany(User, { through: UserReadingList })
User.belongsToMany(Blog, { through: UserReadingList })

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