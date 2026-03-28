const router = require('express').Router()
const { Session } = require('../models')
const sessionValidator = require('../util/sessionValidator')

router.delete('/', sessionValidator, async (req, res, next) => {
  try {
    
    const token = req.token

    const deleted = await Session.destroy({
      where: { token }
    })

    console.debug('Deleted sessions', deleted)

    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' })
    }

    return res.status(204).json({ message: 'Logged out successfully' })

  } catch (error) {
    next(error)
  }
})

module.exports = router