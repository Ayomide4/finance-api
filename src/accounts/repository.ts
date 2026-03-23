import pool from "../db/index.js";
import type { Account, AccountType, AccountWithBalance } from "../types.js";


export async function saveAccount(userId: string, accountName: string, accountType: AccountType) {
  const result = await pool.query("INSERT INTO accounts (user_id, account_name, account_type) VALUES ($1, $2, $3) RETURNING *", [userId, accountName, accountType])
  const account: Account = result.rows[0]

  return { ...account, balance: 0 } as AccountWithBalance
}
