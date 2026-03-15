const router = require('express').Router()
const { Blog, User } = require('../models')

// Endpoint to reset the database (for testing purposes)
router.post('/', async (req, res, next) => {
  try {
    await Blog.destroy({ where: {} })
    await User.destroy({ where: {} })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router