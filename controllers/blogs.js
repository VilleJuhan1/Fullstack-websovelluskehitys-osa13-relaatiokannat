const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()  
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  console.log('Received blog:', req.blog.toJSON())
  res.json(req.blog)
})

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  console.log('Updating blog:', req.blog.toJSON())
  req.blog.author = req.body.author
  req.blog.url = req.body.url
  req.blog.title = req.body.title
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
    res.status(204).end()
})

module.exports = router