import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

const saltRound = 10

export async function getHashedPassword(password) {
  const salt = await bcrypt.genSalt(saltRound)
  const bcryptPassword = await bcrypt.hash(password, salt)
  return bcryptPassword
}

export function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' })
}
