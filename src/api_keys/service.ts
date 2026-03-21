import { randomBytes, createHash } from "crypto";
import { createApiKey } from "./repository.js";

export async function generateApiKey(userId: string, name?: string): Promise<string> {
  // generate raw api key + create prefix
  const buf: Buffer = randomBytes(32)
  const raw_api_key: string = buf.toString('hex')
  const prefix: string = "sk_" + raw_api_key.substring(0, 10)


  // generate hashed api key
  const hash = createHash('sha256')
  hash.update(raw_api_key)
  const api_key_hash = hash.digest('hex')

  console.log(api_key_hash)

  const res = createApiKey(userId, api_key_hash, prefix, name)

  return res

}

