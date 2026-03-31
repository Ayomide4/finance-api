import type { Transaction, TransactionType } from "../types.js";
import { getTransactionById, listAccountTransactions, reverseTransactionById, saveTransaction } from "./repository.js";

export async function createTransaction(
  userId: string,
  accountId: string,
  categoryId: string,
  amount: number,
  type: TransactionType): Promise<Transaction> {

  if (!userId) {
    throw new Error("User id is required")
  }

  try {
    const res = await saveTransaction(userId, accountId, categoryId, amount, type)
    return res
  } catch (err) {
    console.error("Error creating transaction", err)
    throw new Error("Error creating transaction, try again")
  }
}

export async function getAccountTransations(accountId: string, limit: number, offset: number): Promise<Transaction[]> {
  if (!accountId) throw new Error("Account id is required")

  let res;

  try {
    res = await listAccountTransactions(accountId, limit, offset)
  } catch (err) {
    console.error("Database error while getting transactions from account", err)
    throw new Error("Internal Server Error")
  }

  if (!res.length) {
    throw new Error("No transactions found")
  }

  return res
}

export async function getTransaction(accountId: string, transactionId: string): Promise<Transaction> {
  if (!accountId) throw new Error("Account id is required")
  if (!transactionId) throw new Error("Transaction id is required")

  let res;

  try {
    res = await getTransactionById(accountId, transactionId)
  } catch (err) {
    console.error("Database error while getting transaction", err)
    throw new Error("Internal Server Error")
  }

  if (!res) {
    throw new Error("No transaction found")
  }
  return res
}

export async function reverseTransaction(accountId: string, transactionId: string) {
  if (!accountId) throw new Error("Account id is required")
  if (!transactionId) throw new Error("Transaction id is required")

  let res;

  try {
    res = await reverseTransactionById(accountId, transactionId)
  } catch (err) {
    console.error("Database error while reversing transaction", err)
    throw new Error("Internal Server Error")
  }

  if (!res.success) {
    throw new Error("Failed to reverse transaction")
  }
  return res
}
