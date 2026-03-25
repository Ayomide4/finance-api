import { createHash } from "node:crypto"


export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}


export function createHashFromRaw(rawApiKey: string): string {
  const hash = createHash('sha256')
  hash.update(rawApiKey)
  return hash.digest('hex')
}
