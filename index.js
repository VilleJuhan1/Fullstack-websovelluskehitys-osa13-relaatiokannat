const express = require('express')
const errorHandler = require("./middleware/errorHandler");
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const resetRouter = require('./controllers/reset')
const readingListsRouter = require('./controllers/readingLists')
const logoutRouter = require('./controllers/logout')

require('./models')

const app = express()
app.use(express.json())

// Routes
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/reset', resetRouter)
app.use('/api/readinglists', readingListsRouter)
app.use('/api/logout', logoutRouter)


// Basic route to check if the server is running
app.get('/', (req, res) => {
  console.log('Received request to /')
  res.status(200).send('Hello World!')
})

// Handle unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
})

// Error handling middleware
app.use(errorHandler)

// Start the server after connecting to the database
const start = async () => {
  await connectToDatabase()

  // Handled via migrations, so no need to sync models here
  // await sequelize.sync()   // Sync all models in correct order

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()