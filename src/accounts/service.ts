import type { Account, AccountType, AccountWithBalance, Transaction } from "../types.js";
import { changeAccountName, deleteAccountById, getAccountById, listAccountsByUser, listAccountTransactions, saveAccount } from "./repository.js";


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

export async function getAccount(userId: string, accountId: string) {
  if (!userId) throw new Error("User id is required")
  if (!accountId) throw new Error("Account id is required")

  let res;

  try {
    res = await getAccountById(userId, accountId)
  } catch (err) {
    console.error("Database error while getting account", err)
    throw new Error("Internal server error")
  }

  if (!res) {
    throw new Error("Account not found")
  }
  return res
}

export async function getAccountTransations(accountId: string, limit: number, offset: number): Promise<Transaction[]> {
  if (!accountId) throw new Error("Account id is required")

  let res;

  try {
    res = await listAccountTransactions(accountId, limit, offset)
  } catch (err) {
    console.error("Database error while getting transactions from account")
    throw new Error("Internal Serve Error")
  }

  if (!res.length) {
    throw new Error("No transactions found")
  }

  return res
}
