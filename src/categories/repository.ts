import { pool } from "../db/index.js";

export async function saveCategory(userId: string, name: string) {
  const res = await pool.query("INSERT INTO categories (userId, name) VALUES ($1, $2) RETURNING *", [userId, name])
  return res.rows[0]
}


