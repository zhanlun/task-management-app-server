import db from '../db/index.js'
import bcrypt from 'bcrypt'
import { generateAccessToken, getHashedPassword } from './util.js'

export const loginUser = async (req, res) => {
  // Authenticate User
  const { username, password } = req.body

  const { rows } = await db.query('SELECT * FROM app_user WHERE username = $1', [username])

  if (rows.length === 0) {
    return res.status(401).send('Username or password is incorrect')
  }
  const validPassword = await bcrypt.compare(password, rows[0].password)
  if (!validPassword) {
    return res.status(401).send('Username or password is incorrect')
  }

  const user = {
    username
  }
  const accessToken = generateAccessToken(user)
  return res.json({ accessToken: accessToken })
}

export const loadUser = async (req, res) => {
  const user = req.user
  const accessToken = generateAccessToken({
    username: user.username
  })
  return res.json({ ...user, accessToken })
}

export const signUpUser = async (req, res) => {
  // Authenticate User
  const { username, password } = req.body

  const { rows } = await db.query('SELECT * FROM app_user WHERE username = $1', [username])

  if (rows.length > 0) {
    return res.status(409).send('Username already exists')
  }

  if (username.length < 4 || password.length < 4) {
    return res.status(400).send('Invalid input')
  }

  const hashedPassword = await getHashedPassword(password)

  try {
    await db.query(
      `
        INSERT INTO app_user (username, password) VALUES ($1, $2)
      `,
      [
        username,
        hashedPassword,
      ]
    )
  } catch (error) {
    return res.status(500).json(error.message)
  }
  const user = {
    username
  }
  const accessToken = generateAccessToken(user)
  return res.json({ accessToken: accessToken })
}