const Blog = require('./blog')

// Create the Blog table using the model if it doesn't exist already
Blog.sync()

module.exports = {
  Blog
}