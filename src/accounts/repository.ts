import { pool } from "../db/index.js";
import type { Account, AccountType, AccountWithBalance, Transaction } from "../types.js";


export async function saveAccount(userId: string, accountName: string, accountType: AccountType) {
  const result = await pool.query("INSERT INTO accounts (user_id, account_name, account_type) VALUES ($1, $2, $3) RETURNING *", [userId, accountName, accountType])
  const account: Account = result.rows[0]

  return { ...account, balance: 0 } as AccountWithBalance
}

export async function getAccountBalance(accountId: string) {
  const query = "SELECT SUM(CASE WHEN type = 'credit' THEN amount ELSE - amount END) as balance FROM transactions WHERE account_id = $1 AND status = 'posted'"
  const res = await pool.query(query, [accountId])
  return res.rows[0]
}

//TODO: update to include actual balance calculated from transactions
export async function getAccountById(userId: string, accountId: string) {
  const res = await pool.query("SELECT * FROM accounts WHERE user_id = $1 AND id = $2", [userId, accountId])
  //TODO: add getAccountBalance
  return { ...res.rows[0], balance: 0 }
}

//TODO: update to include actual balance calculated from transactions
export async function listAccountsByUser(userId: string, limit: number, offset: number) {
  const result = await pool.query("SELECT * FROM accounts WHERE user_id = $1 LIMIT $2 OFFSET $3", [userId, limit, offset])
  const accounts = result.rows

  const accountsWithBalance = accounts.map((account: Account) => ({
    ...account,
    balance: 0
  }))

  return accountsWithBalance
}


export async function changeAccountName(userId: string, accountName: string, accountId: string) {
  const result = await pool.query("UPDATE accounts SET account_name = $1 WHERE id = $2 AND user_id = $3 RETURNING *", [accountName, accountId, userId])
  return result.rows[0]
}

export async function deleteAccountById(userId: string, accountId: string): Promise<Account> {
  const account_status = 'closed'
  const res = await pool.query('UPDATE accounts SET account_status = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [account_status, accountId, userId])

  return res.rows[0]
}


