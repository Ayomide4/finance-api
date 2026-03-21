import { Hono } from "hono"
import { generateApiKey } from "./service.js"

export const api_keys = new Hono()

api_keys.get('/', async (c) => {
  // at the health endpoint we're querying the pool to see if the db is connected
  try {
    return c.json({ status: "ok" }, 200)
  } catch (err) {
    console.error("Database health check failed: \n", err)
    return c.json({ status: "error" }, 503)
  }
})

api_keys.post("/", async (c) => {
  try {
    const res = generateApiKey("115cdbf6-54fe-4e26-9ab1-66de4dcb9856", "test")
    return c.json(res, 200)
  }
  catch (error) {
    console.error("Error creating api key", error)
    return c.json({ status: "error" }, 400)
  }
})
