import type { AccountType, AccountWithBalance } from "../types.js";
import { saveAccount } from "./repository.js";


export async function createAccount(userId: string, accountName: string, accountType: AccountType): Promise<AccountWithBalance> {

  if (!userId) {
    throw new Error("user id is required")
  }

  try {
    const response = await saveAccount(userId, accountName, accountType)

    console.log("ACCOUNT SERVICE RESPONSE", response)
    return response

  } catch (err) {
    console.error("Error creating account", err)
    throw new Error("Error creating account, please try again")
  }


}
