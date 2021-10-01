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
  const { title } = req.body
  try {
    const { rows } = await db.query(
      `UPDATE board
      SET title = $1,
      last_update_date = NOW()
      WHERE id = $2
      RETURNING *`,
      [
        title,
        id,
      ]
    )
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const createBoard = async (req, res) => {
  const { title } = req.body
  try {
    const { rows } = await db.query('INSERT INTO board (title, created_date, last_update_date) VALUES($1, NOW(), NOW()) RETURNING *', [
      title,
    ])
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const updateCardListIdOrderOfBoard = async (req, res) => {
  const { boardId } = req.params
  const { rows } = await db.query('SELECT * FROM board WHERE id = $1', [boardId])
  if (rows.length === 0) {
    res.status(404).send('Not found')
    return
  }
  const { card_list_ids_order } = req.body

  try {
    const { rows } = await db.query(
      `UPDATE board
      SET card_list_ids_order = $1,
      last_update_date = NOW()
      WHERE id = $2
      RETURNING *`,
      [
        card_list_ids_order,
        boardId,
      ]
    )
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}