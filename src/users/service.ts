import { saveUser } from "./repository.js";
import { isValidEmail } from "../utils.js";
import { generateApiKey } from "../api_keys/service.js";
import type { User } from "../types.js";


export async function createUser(email: string): Promise<User> {
  if (!email) {
    throw new Error("user email is required")
  }

  if (!isValidEmail(email)) {
    throw new Error("user email is invalid")
  }

  try {
    const res = await saveUser(email)
    console.log('USER ID: ', res.id)
    const apiKey: string = await generateApiKey(res.id)
    const userObj: User = { ...res, api_key: apiKey }

    return userObj

  } catch (err) {
    console.error("Error saving user to db", err)
    throw new Error("Could not create user. Please try again later")
  }
}
