import db from '../db/index.js'
import validator from 'validator';

export const getBoards = async (req, res) => {
  const { user } = req
  const { rows } = await db.query('SELECT * FROM board WHERE created_by = $1', [user.id])
  res.json(rows)
}

export const getBoardById = async (req, res) => {
  const { id } = req.params
  if (!validator.isUUID(id)) {
    return res.status(404).send('Not found')
  }
  const { rows } = await db.query('SELECT * FROM board WHERE id = $1', [id])
  if (rows.length === 0) {
    res.status(404).send('Not found')
  }
  res.json(rows[0])
}

export const deleteBoardById = async (req, res) => {
  const { id } = req.params
  if (!validator.isUUID(id)) {
    return res.status(404).send('Not found')
  }
  const { rows } = await db.query('SELECT * FROM board WHERE id = $1', [id])
  if (rows.length === 0) {
    res.status(404).send('Not found')
  }
  await db.query('DELETE FROM board WHERE id = $1', [id])
  req.app.get('socketService').emitter('board:delete', rows[0].id, id)
  res.status(200).send('Success')
}

export const updateBoardById = async (req, res) => {
  const { id } = req.params
  if (!validator.isUUID(id)) {
    return res.status(404).send('Not found')
  }
  const { rows } = await db.query('SELECT * FROM board WHERE id = $1', [id])
  if (rows.length === 0) {
    res.status(404).send('Not found')
  }
  const { title, card_list_ids_order, disable_public_edit } = req.body
  try {
    const { rows } = await db.query(
      `UPDATE board
      SET title = $1,
      card_list_ids_order = $2,
      disable_public_edit = $3,
      last_update_date = NOW()
      WHERE id = $4
      RETURNING *`,
      [
        title,
        card_list_ids_order,
        disable_public_edit,
        id,
      ]
    )
    req.app.get('socketService').emitter('board:update', rows[0], id)
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const createBoard = async (req, res) => {
  const { user } = req
  const { title } = req.body
  try {
    const { rows } = await db.query('INSERT INTO board (title, created_by, created_date, last_update_date) VALUES($1, $2, NOW(), NOW()) RETURNING *', [
      title,
      user.id,
    ])
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const updateCardListIdOrderOfBoard = async (req, res) => {
  const { boardId } = req.params
  if (!validator.isUUID(boardId)) {
    return res.status(404).send('Not found')
  }
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
    req.app.get('socketService').emitter('board:update', rows[0], boardId)
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}