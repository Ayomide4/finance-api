import pool from "../db/index.js";

export async function createApiKey(userId: string, hash: string, prefix: string, name: string | null = null) {
  const result = await pool.query('INSERT INTO api_keys (user_id, name, prefix, hash) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, name, prefix, hash])

  return result.rows[0];
}

