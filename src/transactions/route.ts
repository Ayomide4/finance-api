import { Hono } from "hono";
import type { Variables } from "../types.js";
import { createTransaction, getAccountTransations, getTransaction, updateTransactionStatus } from "./service.js";

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
    const accountId = c.req.param('id')! //comes from account route 
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

//get single transaction by accountId
transactions.get("/:txId", async (c) => {
  try {
    const accountId = c.req.param('id')! //comes from account route 
    const transactionId = c.req.param("txId")!

    const res = await getTransaction(accountId, transactionId)
    return c.json(res, 200)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"

    if (errorMessage === "No transaction found") {
      return c.json({ errror: errorMessage }, 404)
    }
    return c.json({ error: "Failed to get transaction" }, 400)
  }
})

//reverse transaction
transactions.post("/txId/reverse", async (c) => {
  try {

  } catch (err) {

  }
})

transactions.patch("/:txId/post", async (c) => {
  try {
    const accountId = c.req.param('id')!
    const transactionId = c.req.param('txId')!
    const userId = c.get('userId')
    const ip = c.req.header('x-forwarded-for') || '0.0.0.0';

    const res = await updateTransactionStatus(accountId, transactionId, userId, ip)
    return c.json(res, 200)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"

    if (errorMessage.includes("ineligible")) {
      return c.json({ error: errorMessage }, 400)
    }

    return c.json({ error: "Failed to post transaction" }, 500)

  }
})
