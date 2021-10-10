import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

if (process.env.NODE_ENV !== 'production') {
  import dotenv from 'dotenv'
  dotenv.config()
}

const saltRound = 10

export async function getHashedPassword(password) {
  const salt = await bcrypt.genSalt(saltRound)
  const bcryptPassword = await bcrypt.hash(password, salt)
  return bcryptPassword
}

export function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' })
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

export function authenticateTokenOptional(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader

  if (!token) {
    next()
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

}
