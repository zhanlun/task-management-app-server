import db from '../db/index.js'

export const getCardsByBoardId = async (req, res) => {
  const { boardId } = req.params
  try {
    const { rows: boardRows } = await db.query('SELECT * FROM board WHERE id = $1', [boardId])
    if (boardRows.length === 0) {
      res.status(404).send('Not found')
    }

    const { rows: cardListRows } = await db.query(
      `
      SELECT * FROM card c
      WHERE c.card_list_id in (
        SELECT cl.id as card_list_id
        FROM board b LEFT JOIN card_list cl 
        ON b.id = cl.board_id
        WHERE b.id = $1
      )
      `,
      [boardId])
    res.json(cardListRows)
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const getCardsByCardListId = async (req, res) => {
  const { cardListId } = req.params
  try {
    const { rows: cardListRows } = await db.query('SELECT * FROM card_list WHERE id = $1', [cardListId])
    if (cardListRows.length === 0) {
      res.status(404).send('Not found')
    }

    const { rows } = await db.query('SELECT * FROM card WHERE card_list_id = $1', [cardListId])
    res.json(rows)
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const createCardByCardListId = async (req, res) => {
  const { cardListId } = req.params
  const { content } = req.body
  try {
    const { rows: cardListRows } = await db.query('SELECT * FROM card_list WHERE id = $1', [cardListId])
    if (cardListRows.length === 0) {
      res.status(404).send('Not found')
    }

    const { rows } = await db.query('INSERT INTO card (content, card_list_id, board_id, created_date, last_update_date) VALUES($1, $2, $3, NOW(), NOW()) RETURNING *', [
      content,
      cardListId,
      cardListRows[0].board_id,
    ])

    const cardId = rows[0].id
    await db.query('UPDATE card_list SET card_ids_order = array_append(card_ids_order, $1), last_update_date = NOW() WHERE id = $2', [
      cardId,
      cardListId,
    ])
    req.app.get('socketService').emitter('card:create', rows[0], cardListRows[0].board_id)
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const deleteCardById = async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query('SELECT * FROM card WHERE id = $1', [id])
  if (rows.length === 0) {
    res.status(404).send('Not found')
  }

  const { card_list_id } = rows[0]
  await db.query('DELETE FROM card WHERE id = $1', [id])
  await db.query('UPDATE card_list SET card_ids_order = array_remove(card_ids_order, $1), last_update_date = NOW() where id = $2', [id, card_list_id])
  req.app.get('socketService').emitter('card:delete', rows[0].id, rows[0].board_id)
  res.status(200).send('Success')
}

export const updateCardById = async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query('SELECT * FROM card WHERE id = $1', [id])
  if (rows.length === 0) {
    res.status(404).send('Not found')
  }
  const { content, card_list_id } = req.body
  try {
    const { rows } = await db.query(
      `UPDATE card
      SET content = $1,
      card_list_id = $2,
      last_update_date = NOW()
      WHERE id = $3
      RETURNING *`,
      [
        content,
        card_list_id,
        id,
      ]
    )
    req.app.get('socketService').emitter('card:update', rows[0], rows[0].board_id)
    res.json(rows[0])
  } catch (error) {
    res.status(400).json(error.message)
  }
}