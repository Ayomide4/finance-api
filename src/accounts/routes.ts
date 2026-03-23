import { Hono } from "hono";
import type { Variables } from "../types.js";
import { createAccount } from "./service.js";


export const accounts = new Hono<{ Variables: Variables }>()

accounts.post("/", async (c) => {
  try {
    const userId = c.get("userId")
    const { accountName, accountType } = await c.req.json()

    const account = await createAccount(userId, accountName, accountType)
    return c.json(account, 201)

  } catch (err) {
    console.error("Error creating account", err)
    return c.json("Failed to create account", 400)

  }
})
