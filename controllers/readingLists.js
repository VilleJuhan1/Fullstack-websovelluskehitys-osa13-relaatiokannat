const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

/*
Post to the reading list table with the following format:
{
  "blogId": 5,
  "userId": 3
}
*/
router.get('/', async (req, res, next) => {
    res.json({ message: 'Reading list endpoint' })
})

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

    // ✅ use correct association
    const exists = await user.hasReadingList(blog)
    if (exists) {
      const error = new Error('Blog already in reading list')
      error.status = 400
      return next(error)
    }

    await user.addReadingList(blog, {
      through: { blog_read: false } // optional default
    })

    res.status(201).json({ message: 'Blog added to reading list' })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  const { id } = req.params
  const { blog_read } = req.body

  if (blog_read === undefined) {
    const error = new Error('blog_read field required')
    error.status = 400
    return next(error)
  }

  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.findByPk(id)

    if (!user || !blog) {
      const error = new Error('User or Blog not found')
      error.status = 404
      return next(error)
    }

    // Check if blog exists in user's reading list
    const exists = await user.hasReadingList(blog)
    if (!exists) {
      const error = new Error('Blog not in reading list')
      error.status = 400
      return next(error)
    }

    await user.addReadingList(blog, {
      through: { blog_read }
    })

    res.json({ message: 'Reading status updated' })
  } catch (error) {
    next(error)
  }
})

/*
router.post('/', async (req, res, next) => {
    // console.log('Received request to add blog to reading list:', req)
    const { blogId, userId } = req.body || {}
    if (!blogId || !userId) {
        const error = new Error('blogId and userId required')
        error.status = 400
        return next(error)
    }
    // console.log('Received request to add blog to reading list:', { blogId, userId })
    try {
        const user = await User.findByPk(userId)
        const blog = await Blog.findByPk(blogId)

        if (!user || !blog) {
            const error = new Error('User or Blog not found')
            error.status = 404
            return next(error)
        }

        // Check if the blog is already in the user's reading list
        const existingEntry = await user.hasBlogs(blog)
        if (existingEntry) {
            const error = new Error('Blog already in reading list')
            error.status = 400
            return next(error)
        }

        await user.addBlogs(blog)
        res.status(201).json({ message: 'Blog added to reading list' })
    } catch (error) {
        next(error)
    }
})
*/
module.exports = router