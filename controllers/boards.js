import db from '../db/index.js'

export const getBoards = async (req, res) => {
  const { rows } = await db.query('SELECT * FROM board', [])
  res.json(rows)
}

export const getBoardById = async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query('SELECT * FROM board WHERE id = $1', [id])
  if (rows.length === 0) {
    res.status(404).send('Not found')
  }
  res.json(rows[0])
}

export const deleteBoardById = async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query('SELECT * FROM board WHERE id = $1', [id])
  if (rows.length === 0) {
    res.status(404).send('Not found')
  }
  await db.query('DELETE FROM board WHERE id = $1', [id])
  res.status(200).send('Success')
}

export const updateBoardById = async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query('SELECT * FROM board WHERE id = $1', [id])
  if (rows.length === 0) {
    res.status(404).send('Not found')
  }
  const { name } = req.body
  try {
    const { rows } = await db.query(
      `UPDATE board
      SET name = $1
      WHERE id = $2
      RETURNING *`,
      [
        name,
        id,
      ]
    )
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const createBoard = async (req, res) => {
  const { name } = req.body
  try {
    const { rows } = await db.query('INSERT INTO board (name, created_date) VALUES($1, NOW()) RETURNING *', [
      name,
    ])
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}