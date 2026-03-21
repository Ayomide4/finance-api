import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import pool from '../src/db/index.js'
import { api_keys } from './api_keys/route.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/health', async (c) => {
  // at the health endpoint we're querying the pool to see if the db is connected
  try {
    const query = await pool.query("SELECT 1")
    return c.json({ status: "ok" }, 200)
  } catch (err) {
    console.error("Database health check failed: \n", err)
    return c.json({ status: "error" }, 503)
  }
})

app.route('/api_key', api_keys)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
