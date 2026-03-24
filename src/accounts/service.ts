import type { Account, AccountType, AccountWithBalance } from "../types.js";
import { changeAccountName, deleteAccountById, listAccountsByUser, saveAccount } from "./repository.js";


export async function createAccount(userId: string, accountName: string, accountType: AccountType): Promise<AccountWithBalance> {
  if (!userId) {
    throw new Error("user id is required")
  }

  try {
    const response = await saveAccount(userId, accountName, accountType)
    return response
  } catch (err) {
    console.error("Error creating account", err)
    throw new Error("Error creating account, please try again")
  }
}

export async function listAccountsWithBalance(userId: string, limit: number, offset: number) {
  if (!userId) {
    throw new Error("user id is required")
  }
  try {
    return await listAccountsByUser(userId, limit, offset)
  } catch (err) {
    console.error("Error getting accounts", err)
    throw new Error("Error getting accounts, try again later")
  }
}

export async function updateAccountName(userId: string, accountName: string, accountId: string): Promise<Account> {
  try {
    const response = await changeAccountName(userId, accountName, accountId)
    return response
  } catch (err) {
    console.error("Error updating account name", err)
    throw new Error("Error updating account")
  }
}

export async function deleteAccount(userId: string, accountId: string): Promise<Account> {
  if (!userId) {
    throw new Error("user id is required")
  }

  try {
    const res = await deleteAccountById(userId, accountId)
    return res
  } catch (err) {
    console.error("Error deleting account", err)
    throw new Error("Error deleting account, please try again")
  }
}

// export async function getAccountById(accountId: string) {
//
// }
