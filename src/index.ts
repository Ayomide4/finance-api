import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import pool from '../db/index.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/health', async (c) => {
  try {
    const query = await pool.query("SELECT 1")
    return c.json({ status: "ok" }, 200)
  } catch (err) {
    console.error("Database health check failed: \n", err)
    return c.json({ status: "error" }, 503)
  }
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
