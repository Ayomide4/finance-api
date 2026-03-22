import pool from "../db/index.js";

export async function saveUser(email: string) {
  const result = await pool.query('INSERT INTO users (email) VALUES ($1)  RETURNING *', [email])

  return result.rows[0]
}
