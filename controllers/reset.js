const router = require('express').Router()
const { Blog, User, Session, UserReadingList } = require('../models')

// Endpoint to reset the database (for testing purposes)
router.post('/', async (req, res, next) => {
  try {
    await Blog.destroy({ where: {} })
    await User.destroy({ where: {} })
    await Session.destroy({ where: {} })
    await UserReadingList.destroy({ where: {} })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router