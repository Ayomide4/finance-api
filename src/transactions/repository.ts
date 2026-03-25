import { pool } from "../db/index.js";
import type { TransactionType } from "../types.js";

export async function saveTransaction(
  userId: string,
  accountId: string,
  categoryId: string,
  amount: number,
  type: TransactionType
) {

  const client = await pool.connect()
  //creates dedicated connection from pool
  //we do this to ensure all our queries are on the same connection otherwise BEGIN, COMMIT, ROLLBACK wont work

  try {
    await client.query("BEGIN")
    const res = await client.query("INSERT INTO transactions (userId, accountId, categoryId, amount, type) VALUE ($1, $2, $3, $4, $5) RETURNING *", [userId, accountId, categoryId, amount, type])
    // await client.query("INSERT INTO audit_log")
    await client.query("COMMIT")
    return res.rows[0]
  } catch (err) {
    await client.query("ROLLBACK")
  } finally {
    client.release()
  }
}


export async function reverseTransactionById(userId: string, transactionId: string) {

}

