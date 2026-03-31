import { pool } from "../db/index.js";
import type { Transaction, TransactionType } from "../types.js";

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

    const queryText = `
      INSERT INTO transactions (userId, accountId, categoryId, amount, type) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;

    const res = await client.query(queryText, [userId, accountId, categoryId, amount, type]);

    // await client.query("INSERT INTO audit_log")

    await client.query("COMMIT")
    return res.rows[0]
  } catch (err) {
    try {
      await client.query("ROLLBACK")
    } catch (err) {
      console.error("Rollback failed:", err)
    }
    throw (err)
  } finally {
    client.release()
  }
}

export async function listAccountTransactions(accountId: string, limit: number, offset: number,): Promise<Transaction[]> {
  const res = await pool.query("SELECT * from transactions WHERE account_id = $1 LIMIT $2 OFFSET $3", [accountId, limit, offset])
  return res.rows
}


// export async function reverseTransactionById(userId: string, transactionId: string) {
//
// }

