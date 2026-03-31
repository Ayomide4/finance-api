import { Hono } from "hono";
import type { Variables } from "../types.js";
import { createTransaction, getAccountTransations } from "./service.js";

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

transactions.get("/", async (c) => {
  try {
    const accountId = c.req.param('id') //comes from account route 

    if (!accountId) {
      throw new Error("Account Id is required")
    }

    const { limit, offset } = c.req.query()
    const limitNum = Math.min(Number(limit) || 20, 100)
    const offsetNum = Number(offset) || 0

    const res = await getAccountTransations(accountId, limitNum, offsetNum)
    return c.json(res, 200)
  } catch (err) {

    const errorMessage = err instanceof Error ? err.message : "Unknown error"

    if (errorMessage === "No transactions found") {
      return c.json({ error: "No transactions found" }, 404)
    }
    return c.json({ error: "Failed to get account transactions" }, 400)
  }
})

