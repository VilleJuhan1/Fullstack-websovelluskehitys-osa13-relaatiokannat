const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Blog, User, UserReadingList } = require('../models')
const { Op } = require('sequelize')
const sessionValidator = require('../util/sessionValidator')

router.get('/', async (req, res, next) => {
  res.json({ message: 'Reading list endpoint' })
})

// Add a blog to the user reading list
router.post('/', async (req, res, next) => {
  const { blogId, userId } = req.body || {}

  if (!blogId || !userId) {
    const error = new Error('blogId and userId required')
    error.status = 400
    return next(error)
  }

  try {
    const user = await User.findByPk(userId)
    const blog = await Blog.findByPk(blogId)

    if (!user || !blog) {
      const error = new Error('User or Blog not found')
      error.status = 404
      return next(error)
    }

    const exists = await user.hasReadings(blog)
    if (exists) {
      const error = new Error('Blog already in reading list')
      error.status = 400
      return next(error)
    }

    const [entry] = await user.addReadings(blog, {
      through: { blog_read: false }
    })

    console.log('Added blog to reading list:', entry.toJSON())

    const data = entry.toJSON()

    res.status(201).json({
      ...data
    })
  } catch (error) {
    next(error)
  }
})

// Change the status of a blog entry in a reading list (read or not)
router.put('/:id', sessionValidator, async (req, res, next) => {
  console.log('Reading list put operation validated with:',req.user, req.token)
  try {
    const { read } = req.body
    const { id } = req.params

    if (typeof read !== 'boolean') {
      const error = new Error('Read must be a boolean value')
      error.status = 400
      return next(error)
    }

    const entry = await UserReadingList.findByPk(id)
    console.log('Entry to be changed:', entry)

    if (!entry) {
      const error = new Error('Reading list entry not found')
      error.status = 404
      return next(error)
    }

    if (entry.user_id !== req.user.id) {
      const error = new Error('Not authorized to modify this entry')
      error.status = 401
      return next(error)
    }

    entry.read = read
    await entry.save()

    res.json({
      ...entry.toJSON()
    })    

  } catch (error) {
    next(error)
  }
})  

module.exports = router