import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const connectionString = process.env.CONN_STRING

if (!connectionString) {
  throw new Error('CONN_STRING is not defined in the environment variables')
}

const pool = new Pool({
  connectionString,
})

export default pool

