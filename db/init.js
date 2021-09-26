import db from './index.js'

export const initDb = async () => {
  db.query(
    `CREATE TABLE IF NOT EXISTS board (
      id serial PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      created_date TIMESTAMP NOT NULL
    )`,
    [],
  )
}