import { Hono } from "hono";
import type { Variables } from "../types.js";
import { createCatetgory } from "./service.js";

export const categories = new Hono<{ Variables: Variables }>()

categories.post("/", async (c) => {
  try {
    const userId = c.get("userId")
    const { name } = await c.req.json()

    const res = await createCatetgory(userId, name)
    return c.json(res, 201)
  } catch (err) {
    console.error("Error creating category")
    return c.json({ error: "Failed to create category, please try again" }, 400)
  }
})
