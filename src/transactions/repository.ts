import type { Pool, PoolClient } from "pg";
import { saveAuditLog } from "../audit_log/repository.js";
import { pool } from "../db/index.js";
import type { Transaction, TransactionType } from "../types.js";
import { transactions } from "./route.js";

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

export async function getTransactionById(accountId: string, transactionId: string): Promise<Transaction | undefined> {
  const res = await pool.query("SELECT * FROM transactions WHERE account_id = $1 AND id = $2", [accountId, transactionId])
  return res.rows[0]
}

export async function reverseTransactionById(accountId: string, transactionId: string, userId: string, ip: string) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const oldTransaction = await client.query("SELECT * from transactions WHERE account_id = $1 AND id = $2", [accountId, transactionId])
    const oldTxRes = oldTransaction.rows[0]

    const transactionRes = await client.query("UPDATE transactions SET status = 'reversed', updated_at = NOW() WHERE account_id = $1 AND id = $2", [accountId, transactionId])

    await saveAuditLog(userId, 'transactions', transactionId, "reversed", { status: oldTxRes.status }, { status: "reversed" }, ip, client)


    //adjust balance isn't created yet

    await client.query("COMMIT")
    return { success: true }
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}

export async function setTransactionStatus(accountId: string, transactionId: string, client?: PoolClient) {
  const db = client || pool

  const query = `UPDATE transactions SET status = 'posted', updated_at = NOW() WHERE account_id = $1 AND id = $2 AND status = 'pending'`

  const res = await db.query(query, [accountId, transactionId])
  if (res.rowCount === 0) {
    return null // if id is wrong or already posted
  }

  return res.rows[0]
}

//TODO: audit log addition?

