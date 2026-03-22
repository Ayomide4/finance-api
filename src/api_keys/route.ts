import { Hono } from "hono"
import { generateApiKey } from "./service.js"

export const api_keys = new Hono()

api_keys.post("/", async (c) => {
  try {
    const { user_id, name } = await c.req.json()
    const rawKey = await generateApiKey(user_id, name)
    return c.json({ apiKey: rawKey }, 201)
  }
  catch (error) {
    console.error("Error creating api key", error)
    return c.json({ error: "Failed to create api key" }, 400)
  }
})
