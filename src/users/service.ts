import { saveUser } from "./repository.js";
import { isValidEmail } from "../utils.js";


export async function createUser(email: string) {
  if (!email) {
    throw new Error("user email is required")
  }

  if (!isValidEmail(email)) {
    throw new Error("user email is invalid")
  }

  try {
    const res = await saveUser(email)
    return res
  } catch (err) {
    console.error("Error saving user to db", err)
    throw new Error("Could not create user. Please try again later")
  }
}
