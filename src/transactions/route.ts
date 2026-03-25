import { Hono } from "hono";
import type { Variables } from "../types.js";
import { createTransaction } from "./service.js";

export const transactions = new Hono<{ Variables: Variables }>()

transactions.post("/", async (c) => {
  try {
    const userId = c.get("userId")
    const { accountId, categoryId, amount, type } = await c.req.json()

    const res = await createTransaction(userId, accountId, categoryId, amount, type)
    return c.json(res, 201)
  } catch (err) {
    console.error("Error creating transaction")
    return c.json({ error: "Error creating transaction, please try again" }, 400)
  }
})

