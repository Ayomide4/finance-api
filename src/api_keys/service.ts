import { randomBytes } from "node:crypto";
import { createApiKey, revokeApiKeyByHash } from "./repository.js";
import { createHashFromRaw } from "../utils.js";

export async function generateApiKey(userId: string, name?: string): Promise<string> {
  if (!userId) {
    throw new Error("User id is required")
  }

  // generate raw api key + create prefix
  const buf: Buffer = randomBytes(32)
  const raw_api_key: string = buf.toString('hex')
  const prefix: string = "sk_" + raw_api_key.substring(0, 9)

  // generate hashed api key
  const api_key_hash = createHashFromRaw(raw_api_key)

  try {
    await createApiKey(userId, api_key_hash, prefix, name)
    return raw_api_key
  } catch (err) {
    console.error("Failed to save api key hash to db", err)
    throw new Error("Could not generate API key. Please try again later")
  }
}

export async function revokeApiKey(rawApiKey: string, userId: string) {
  if (!userId) throw new Error("User id is required");
  if (!rawApiKey) throw new Error("Api key is required");

  const hash = createHashFromRaw(rawApiKey);
  let res;

  try {
    res = await revokeApiKeyByHash(hash, userId);
  } catch (err) {
    console.error("Database error during revocation", err);
    throw new Error("Internal server error");
  }

  if (!res) {
    throw new Error("API key not found or already revoked");
  }

  return res;
}


