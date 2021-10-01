import db from './index.js'

export const initDb = async () => {
  await db.query(
    `CREATE TABLE IF NOT EXISTS board (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(50) NOT NULL,
      card_list_ids_order uuid [] DEFAULT '{}',
      created_date TIMESTAMP NOT NULL,
      last_update_date TIMESTAMP NOT NULL
      )`,
    [],
  )

  await db.query(
    `
      CREATE TABLE IF NOT EXISTS card_list (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      board_id uuid REFERENCES board (id) ON DELETE CASCADE,
      title VARCHAR(50) NOT NULL,
      card_ids_order uuid [] DEFAULT '{}',
      created_date TIMESTAMP NOT NULL,
      last_update_date TIMESTAMP NOT NULL
    )
    `,
    []
  )

  await db.query(
    `
      CREATE TABLE IF NOT EXISTS card (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      card_list_id uuid REFERENCES card_list (id) ON DELETE CASCADE,
      content VARCHAR(255) NOT NULL,
      created_date TIMESTAMP NOT NULL,
      last_update_date TIMESTAMP NOT NULL
    )
    `,
    []
  )
}