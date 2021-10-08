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
    username,
    id: rows[0].id,
  }
  const accessToken = generateAccessToken(user)
  return res.json({ ...user, accessToken: accessToken })
}

export const loadUser = async (req, res) => {
  const userId = req.user.id
  const { rows } = await db.query('SELECT * FROM app_user WHERE id = $1', [userId])

  if (rows.length === 0) {
    return res.status(404).send('User not found')
  }

  const user = {
    username: rows[0].username,
    id: rows[0].id,
  }
  const accessToken = generateAccessToken(user)
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
    const { rows } = await db.query(
      `
        INSERT INTO app_user (username, password) VALUES ($1, $2)
        RETURNING *
      `,
      [
        username,
        hashedPassword,
      ]
    )
    const user = {
      username,
      id: rows[0].id,
    }
    const accessToken = generateAccessToken(user)
    return res.json({ ...user, accessToken: accessToken })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}