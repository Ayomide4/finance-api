import { randomBytes, createHash } from "crypto";
import { createApiKey } from "./repository.js";

export async function generateApiKey(userId: string, name?: string): Promise<string> {
  if (!userId) {
    throw new Error('user id is required')
  }
  // generate raw api key + create prefix
  const buf: Buffer = randomBytes(32)
  const raw_api_key: string = buf.toString('hex')
  const prefix: string = "sk_" + raw_api_key.substring(0, 10)

  // generate hashed api key
  const hash = createHash('sha256')
  hash.update(raw_api_key)
  const api_key_hash = hash.digest('hex')

  try {
    await createApiKey(userId, api_key_hash, prefix, name)
    return raw_api_key
  } catch (err) {
    console.error("Failed to save api key hash to db", err)
    throw new Error("Could not generate API key. Please try again later")
  }
}

