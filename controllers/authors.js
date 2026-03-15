const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Blog, User } = require('../models')
const sequelize = require('sequelize')

// Return all blog authors, article count and total likes
router.get('/', async (req, res, next) => {

  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('author')), 'articleCount'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'totalLikes']
      ],
      group: ['author'],
			order: [[sequelize.literal('"totalLikes"'), 'DESC']]
    })
		console.log(JSON.stringify(authors, null, 2))
    res.json(authors)
  } catch (error) {
    next(error)
  }
})

module.exports = router