import pg from 'pg'
import 'dotenv/config'

const { Pool, Client } = pg

const connectionString = process.env.CONN_STRING

if (!connectionString) {
  throw new Error('CONN_STRING is not defined in the environment variables')
}

export const pool = new Pool({
  connectionString,
})

export const client = new Client({
  connectionString
})



