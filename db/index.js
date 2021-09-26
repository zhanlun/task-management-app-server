import pg from 'pg'
const { Pool } = pg

const connectionString = process.env.connectionString || 'postgresql://postgres:123456@localhost:5432/task_management_app'

const pool = new Pool({
  connectionString,
})

export default {
  query: async (text, params) => {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', { text, duration, rows: res.rowCount })
    return res
  },
}