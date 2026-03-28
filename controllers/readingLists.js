const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Blog, User, UserReadingList } = require('../models')
const { Op } = require('sequelize')
const sessionValidator = require('../util/sessionValidator')

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
    const exists = await user.hasReadings(blog)
    if (exists) {
      const error = new Error('Blog already in reading list')
      error.status = 400
      return next(error)
    }
/*
    const data = await user.addReadingList(blog, {
      through: { blog_read: false } // optional default
    })

    console.debug('Added blog to reading list:', data)
    res.status(201).json({ data, message: 'Blog added to reading list' })

    const result = await user.addReadingList(blog, {
      through: { blog_read: false }
    })

    const readingEntry = result[0].get() // or .toJSON()

    console.log('Added blog to reading list:', readingEntry)

    res.status(201).json({
      data: readingEntry,
      message: 'Blog added to reading list'
    })
*/
    const [entry] = await user.addReadings(blog, {
      through: { blog_read: false }
    })

    console.log('Added blog to reading list:', entry.toJSON())

    const data = entry.toJSON()

    res.status(201).json({
      ...data
      //read: data.blog_read // ✅ map to what test expects
    })
  } catch (error) {
    next(error)
  }
})

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
  /*
  const { id } = req.params
  const { read } = req.body

  console.log('Updating reading list entry:', { id, read })
  if (read === undefined) {
    const error = new Error('read field required')
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
    const exists = await user.hasReadings(blog)
    if (!exists) {
      const error = new Error('Blog not in reading list')
      error.status = 400
      return next(error)
    }

    await user.addReadings(blog, {
      through: { read }
    })

    res.json({ message: 'Reading status updated' })
  } catch (error) {
    next(error)
  }
})
*/
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