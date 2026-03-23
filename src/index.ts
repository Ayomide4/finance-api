import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import pool from '../src/db/index.js'
import { api_keys } from './api_keys/route.js'
import { users } from './users/route.js'
import { authMiddleware } from './middleware/auth.js'
import { except } from 'hono/combine'
import type { Variables } from './types.js'
import { accounts } from './accounts/routes.js'

const app = new Hono()
const v1 = new Hono<{ Variables: Variables }>()

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

v1.route('/api-keys', api_keys)
v1.route('/users', users)
v1.route('/accounts', accounts)
v1.use('*', except(['/users']), authMiddleware)

app.route('/v1', v1)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
