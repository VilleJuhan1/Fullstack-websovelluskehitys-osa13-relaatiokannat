const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res, next) => {
   try { 
    const users = await User.findAll( {
      include: {
        model: Blog,
        attributes: { exclude: ['userId'] }
      }
    })
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (user) {
      res.json(user)
    } else {
      const error = new Error('User not found')
      error.status = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

// Update user information with new name
router.put('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.username)
    if (user) {
      const newName = req.body.name
      if (!newName || typeof newName !== 'string' || newName.trim() === '') {
        const error = new Error('Name must be a non-empty string')
        error.status = 400
        return next(error)
      }
      await user.update({ name: newName })
      res.json(user)
    } else {
      const error = new Error('User not found')
      error.status = 404
      next(error)
    }
  } catch(error) {
    next(error)
  }
})

module.exports = router