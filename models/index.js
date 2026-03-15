const Blog = require('./blog')
const User = require('./user')

User.hasMany(Blog, { foreignKey: 'user_id' })
Blog.belongsTo(User, { foreignKey: 'user_id' })

// Create the Blog table using the model if it doesn't exist already
// User.sync({ alter: true })
// Blog.sync({ alter: true })

module.exports = {
  Blog,
  User
}