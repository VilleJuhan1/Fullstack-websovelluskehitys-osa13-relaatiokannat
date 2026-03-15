const express = require('express')
const errorHandler = require("./middleware/errorHandler");
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const resetRouter = require('./controllers/reset')

const app = express()
app.use(express.json())

// Routes
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/reset', resetRouter)

// Basic route to check if the server is running
app.get('/', (req, res) => {
  console.log('Received request to /')
  res.status(200).send('Hello World!')
})

// Handle unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
})

/*
app.use((req, res, next) => {
  const error = new Error('Unknown endpoint')
  error.status = 404
  next(error)
})
*/

// Error handling middleware
app.use(errorHandler)

// Start the server after connecting to the database
const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()