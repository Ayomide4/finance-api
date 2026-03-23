import { Hono } from "hono"
import { generateApiKey } from "./service.js"
import { authMiddleware } from "../middleware/auth.js"
import type { Variables } from "../types.js"

export const api_keys = new Hono<{ Variables: Variables }>()

// TODO: 
// - delete api key route
// - update api key name route?

api_keys.post("/", async (c) => {
  try {
    const user_id = c.get('userId')
    const body = await c.req.json().catch(() => ({}))
    const { name } = body
    const rawKey = await generateApiKey(user_id, name)
    return c.json({ apiKey: rawKey }, 201)
  }
  catch (error) {
    console.error("Error creating api key", error)
    return c.json({ error: "Failed to create api key" }, 400)
  }
})
