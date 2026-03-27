import { pool } from "../db/index.js";
import type { BudgetRuleType, periodType } from "../types.js";


// userId: string;
//   categoryId: string;
//   period: periodType;
//   amountLimit: number;
//   alertThresholdPct: number;

export async function addBudgetRule(
  userId: string,
  categoryId: string,
  period: periodType,
  amountLimit: number
): Promise<BudgetRuleType> {
  const query = `
    INSERT INTO budget_rules (user_id, category_id, period, amount)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [userId, categoryId, period, amountLimit];

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err: any) {
    if (err.code === '23505') {
      throw new Error("A budget rule already exists for this category and period");
    }
    console.error("Database error adding budget rule", err);
    throw new Error("Could not create budget rule");
  }
}

export async function getAllBudgetRules(userId: string): Promise<BudgetRuleType[]> {
  const res = await pool.query("SELECT * FROM budget_rules WHERE userId = $1 ORDER BY created_at DESC", [userId])
  return res.rows
}


