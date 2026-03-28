const router = require('express').Router()

const { User, Blog } = require('../models')

// Get all users
router.get('/', async (req, res, next) => {
   try { 
    const users = await User.findAll( {
      include: {
        model: Blog,
        attributes: { exclude: ['user_id', 'id'] }
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

// Individual user route
router.get('/:id', async (req, res, next) => {
  try {
    const { read } = req.query;

    // Add the where condition for the through table if the read query parameter is provided
    const throughWhere = read !== undefined
      ? { read: read === 'true' }
      : undefined;

    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Blog,
          as: 'blogs',
          attributes: { exclude: ['user_id'] }
        },
        {
          model: Blog,
          as: 'readings',
          attributes: { exclude: ['user_id', 'createdAt', 'updatedAt'] },
          through: {
            attributes: ['read', 'id'],
            // Only include the through table attributes if the read query parameter is provided
            ...(throughWhere && { where: throughWhere })
          }
        }
      ]
    });

    if (user) {
      res.json(user);
    } else {
      const error = new Error('User not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

// Update user information with a new name
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