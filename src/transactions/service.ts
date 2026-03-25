import type { TransactionType } from "../types.js";
import { saveTransaction } from "./repository.js";

export async function createTransaction(
  userId: string,
  accountId: string,
  categoryId: string,
  amount: number,
  type: TransactionType) {

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
