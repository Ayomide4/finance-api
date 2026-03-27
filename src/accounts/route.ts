import { Hono } from "hono";
import type { Variables } from "../types.js";
import { createAccount, deleteAccount, getAccount, getAccountTransations, listAccountsWithBalance, updateAccountName } from "./service.js";
import { transactions } from "../transactions/route.js";

export const accounts = new Hono<{ Variables: Variables }>()

accounts.post("/", async (c) => {
  try {
    const userId = c.get("userId")
    const { accountName, accountType } = await c.req.json()

    const account = await createAccount(userId, accountName, accountType)
    return c.json(account, 201)

  } catch (err) {
    console.error("Error creating account", err)
    return c.json({ error: "Failed to create account" }, 400)

  }
})

accounts.get("/:id", async (c) => {
  try {
    const userId = c.get("userId")
    const accountId = c.req.param("id")

    const res = await getAccount(userId, accountId)
    return c.json(res, 200)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"

    if (errorMessage === "failed to find account") {
      return c.json({ error: "Account not found" }, 404)
    }
    console.error("Failed to find account")
    return c.json({ error: "Failed to serach for account" },)
  }
})

accounts.patch("/:id", async (c) => {
  try {
    const userId = c.get("userId")
    const accountId = c.req.param('id')
    const { accountName } = await c.req.json()

    const account = await updateAccountName(userId, accountName, accountId)
    return c.json(account, 200)
  } catch (err) {
    console.error("Error updating account", err)
    return c.json({ error: "Failed to update account" }, 400)
  }
})

accounts.get("/", async (c) => {
  try {
    const { limit, offset } = c.req.query()
    const limitNum = Math.min(Number(limit) || 20, 100)
    const offsetNum = Number(offset) || 0

    const userId = c.get("userId")
    const accounts = await listAccountsWithBalance(userId, limitNum, offsetNum)
    return c.json(accounts, 200)
  } catch (err) {
    console.error("Error getting user accounts", err)
    return c.json({ error: "Failed to get user accounts" }, 400)
  }
})

accounts.delete('/:id', async (c) => {
  try {
    const userId = c.get("userId")
    const accountId = c.req.param('id')

    const res = await deleteAccount(userId, accountId)
    c.json(res, 200)
  } catch (err) {
    console.error("Error deleting account", err)
    return c.json({ error: "Failed to delete account" }, 400)
  }
})

accounts.get("/:id/transactions", async (c) => {
  try {
    const accountId = c.req.param('id')
    const { limit, offset } = await c.req.json()
    const res = getAccountTransations(accountId, limit, offset)
    c.json(res, 200)
  } catch (err) {

    const errorMessage = err instanceof Error ? err.message : "Unknown error"

    if (errorMessage === "No transactions found") {
      c.json({ error: "No transactions found" }, 404)
    }
    c.json({ error: "Failed to get account transactions" }, 400)
  }
})

//TODO: upate post path transactions?
// accounts.route("/:accountId/transactions", transactions)
