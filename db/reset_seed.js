import db from './index.js'
import { getHashedPassword } from '../auth/util.js'

async function reset() {
  await db.query(
    `TRUNCATE TABLE app_user CASCADE`
  )
  await db.query(
    `TRUNCATE TABLE board CASCADE`
  )
  await db.query(
    `TRUNCATE TABLE card_list CASCADE`
  )
  await db.query(
    `TRUNCATE TABLE card CASCADE`
  )
}

const initDb = async () => {
  await db.query(
    `CREATE TABLE IF NOT EXISTS board (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(50) NOT NULL,
      card_list_ids_order uuid [] DEFAULT '{}',
      created_date TIMESTAMP NOT NULL,
      last_update_date TIMESTAMP NOT NULL,
      created_by uuid NOT NULL,
      disable_public_edit BOOLEAN NOT NULL DEFAULT FALSE
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
      board_id uuid,
      content VARCHAR(255) NOT NULL,
      created_date TIMESTAMP NOT NULL,
      last_update_date TIMESTAMP NOT NULL
      )
      `,
    []
  )

  await db.query(
    `
      CREATE TABLE IF NOT EXISTS app_user (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `,
    []
  )

  await createDemoUser()
}

const createDemoUser = async () => {
  const { rows } = await db.query(
    `
      SELECT * FROM app_user WHERE username = 'demo'
    `,
    []
  )

  const hashedPassword = await getHashedPassword('reactdemo')

  if (rows.length === 0) {
    await db.query(
      `
        INSERT INTO app_user (username, password) VALUES ($1, $2)
      `,
      [
        'demo',
        hashedPassword,
      ]
    )
  }
}

reset().then(() =>
  initDb())