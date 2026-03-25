const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
const { Session, User } = require('../models')

const sessionValidator = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, SECRET)

      // Check if the session exists in the database
      const session = await Session.findOne({ where: { token } })
      if (!session) {
        return res.status(401).json({ error: 'Session not found' })
      }

      if (session.has_access === false) {
        return res.status(403).json({ error: 'Session does not have access' })
      }
      req.user = decodedToken
      req.token = token
      console.log(req.user, req.token)

    } catch (error) {
      return res.status(401).json({ error: 'Token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'Token missing' })
  }
  next()
}

module.exports = sessionValidator
