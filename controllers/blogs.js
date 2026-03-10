const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)

    if (!blog) {
      const error = new Error('Blog not found')
      error.status = 404
      return next(error)
    }

    req.blog = blog
    next()
  } catch (error) {
    next(error)
  }
}

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  console.log('Received blog:', req.blog.toJSON())
  res.json(req.blog)
})

router.post('/', async (req, res, next) => {
  try {
    if (req.body.likes !== undefined || req.body.likes === null || req.body.likes < 0) {
      const error = new Error('Likes must be a non-negative number')
      error.status = 400
      return next(error)
    }
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

// Update the likes of a blog post
router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    const likes = req.body.likes || null
    console.log('Updating blog with likes:', likes)

    if (!Number.isInteger(likes) || likes < 0) {
      const error = new Error('Likes must be a non-negative number')
      error.status = 400
      return next(error)
    }

    req.blog.likes = likes
    await req.blog.save()

    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', blogFinder, async (req, res, next) => {
  try {
    await req.blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router