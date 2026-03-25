import { Hono } from "hono"
import { generateApiKey, revokeApiKey } from "./service.js"
import type { Variables } from "../types.js"

export const api_keys = new Hono<{ Variables: Variables }>()

// TODO: 
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

api_keys.delete("/", async (c) => {
  try {
    const userId = c.get("userId")
    const rawApiKey: string = c.get("rawApiKey")

    await revokeApiKey(rawApiKey, userId)
    return c.json({ message: "Revoked successfully" }, 200)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"

    if (errorMessage === "failed to find api key") {
      return c.json({ error: "API key not found" }, 404)
    }

    console.error("Failed to delete api key", err)
    return c.json({ error: "Failed to revoke api key" }, 400)
  }
})
