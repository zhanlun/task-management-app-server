import db from '../db/index.js'
import bcrypt from 'bcrypt'
import { generateAccessToken } from './util.js'

export const loginUser = async (req, res) => {
  // Authenticate User
  const { username, password } = req.body

  const { rows } = await db.query('SELECT * FROM app_user WHERE username = $1', [username])

  if (rows.length === 0) {
    return res.status(401).send('Email or password is incorrect')
  }
  const validPassword = await bcrypt.compare(password, rows[0].password)
  if (!validPassword) {
    return res.status(401).send('Email or password is incorrect')
  }

  const user = {
    username
  }
  const accessToken = generateAccessToken(user)
  return res.json({ accessToken: accessToken })
}