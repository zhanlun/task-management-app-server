import db from '../db/index.js'
import validator from 'validator';

export const getCardListsByBoardId = async (req, res) => {
  const { boardId } = req.params
  if (!validator.isUUID(boardId)) {
    return res.status(404).send('Not found')
  }
  try {
    const { rows: boardRows } = await db.query('SELECT * FROM board WHERE id = $1', [boardId])
    if (boardRows.length === 0) {
      res.status(404).send('Not found')
    }

    const { rows } = await db.query('SELECT * FROM card_list WHERE board_id = $1', [boardId])
    res.json(rows)
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const getCardListById = async (req, res) => {
  const { id } = req.params
  if (!validator.isUUID(id)) {
    return res.status(404).send('Not found')
  }
  try {
    const { rows } = await db.query('SELECT * FROM card_list WHERE id = $1', [id])
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const createCardListByBoardId = async (req, res) => {
  const { boardId } = req.params
  if (!validator.isUUID(boardId)) {
    return res.status(404).send('Not found')
  }
  const { title } = req.body
  try {
    const { rows: boardRows } = await db.query('SELECT * FROM board WHERE id = $1', [boardId])
    if (boardRows.length === 0) {
      res.status(404).send('Not found')
    }

    const { rows } = await db.query('INSERT INTO card_list (title, board_id, created_date, last_update_date) VALUES($1, $2, NOW(), NOW()) RETURNING *', [
      title,
      boardId,
    ])

    const cardListId = rows[0].id
    await db.query('UPDATE board SET card_list_ids_order = array_append(card_list_ids_order, $1), last_update_date = NOW() WHERE id = $2', [
      cardListId,
      boardId,
    ])
    req.app.get('socketService').emitter('card_list:create', rows[0], rows[0].board_id)
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const deleteCardListById = async (req, res) => {
  const { id } = req.params
  if (!validator.isUUID(id)) {
    return res.status(404).send('Not found')
  }
  const { rows } = await db.query('SELECT * FROM card_list WHERE id = $1', [id])
  if (rows.length === 0) {
    res.status(404).send('Not found')
  }

  const { board_id } = rows[0]
  await db.query('DELETE FROM card_list WHERE id = $1', [id])
  await db.query('UPDATE board SET card_list_ids_order = array_remove(card_list_ids_order, $1), last_update_date = NOW() where id = $2', [id, board_id])
  req.app.get('socketService').emitter('card_list:delete', rows[0].id, rows[0].board_id)
  res.status(200).send('Success')
}

export const updateCardListById = async (req, res) => {
  const { id } = req.params
  if (!validator.isUUID(id)) {
    return res.status(404).send('Not found')
  }
  const { rows } = await db.query('SELECT * FROM card_list WHERE id = $1', [id])
  if (rows.length === 0) {
    res.status(404).send('Not found')
  }
  const { title, board_id, card_ids_order } = req.body
  try {
    const { rows } = await db.query(
      `UPDATE card_list
      SET title = $1,
      board_id = $2,
      card_ids_order = $3,
      last_update_date = NOW()
      WHERE id = $4
      RETURNING *`,
      [
        title,
        board_id,
        card_ids_order,
        id,
      ]
    )
    req.app.get('socketService').emitter('card_list:update', rows[0], rows[0].board_id)
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const updateCardIdOrderOfCardList = async (req, res) => {
  const { cardListId } = req.params
  if (!validator.isUUID(cardListId)) {
    return res.status(404).send('Not found')
  }
  const { rows } = await db.query('SELECT * FROM card_list WHERE id = $1', [cardListId])
  if (rows.length === 0) {
    res.status(404).send('Not found')
  }
  const { card_ids_order } = req.body

  try {
    const { rows } = await db.query(
      `UPDATE card_list
      SET card_ids_order = $1,
      last_update_date = NOW()
      WHERE id = $2
      RETURNING *`,
      [
        card_ids_order,
        cardListId,
      ]
    )
    req.app.get('socketService').emitter('card_list:update', rows[0], rows[0].board_id)
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}