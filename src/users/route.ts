import { Hono } from "hono"
import { createUser } from "./service.js"

export const users = new Hono()


// TODO: 
// - route for soft deleting users

users.post('/', async (c) => {
  try {
    const { email } = await c.req.json()
    const response = await createUser(email)
    const { id } = response
    return c.json({ user: { id, email }, apiKey: response.apiKey }, 201)
  } catch (err) {
    console.error("error creating user", err)
    return c.json({ error: "There was an error creating the user" }, 400)
  }
})
