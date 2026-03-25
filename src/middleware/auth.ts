import { createHash } from "node:crypto";
import { createMiddleware } from "hono/factory";
import { findApiKeyByHash } from "../api_keys/repository.js";
import type { Variables } from "../types.js";


export const authMiddleware = createMiddleware<{ Variables: Variables }>(async (c, next) => {
  const authToken = c.req.header('Authorization')

  if (!authToken) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  if (!authToken.startsWith("Bearer ")) {
    return c.json({ error: 'Unauthorized' }, 401)
  }


  const rawApiKey: string = authToken.substring("Bearer ".length) // remove Bearer from string

  const hash = createHash('sha256')
  hash.update(rawApiKey)
  const apiKeyHash = hash.digest('hex') //create the hash of the rawApiKey


  try {
    const userId: string | null = await findApiKeyByHash(apiKeyHash) // return the user id

    if (userId == null) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    c.set('userId', userId) //set userId in context so it can be used elsewhere
    c.set('rawApiKey', rawApiKey)

  } catch (err) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }

  await next()
})



