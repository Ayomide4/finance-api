import pool from "../db/index.js";

export async function createApiKey(userId: string, hash: string, prefix: string, name: string | null = null) {
  const result = await pool.query('INSERT INTO api_keys (user_id, name, prefix, hash) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, name, prefix, hash])

  return result.rows[0];
}

export async function findApiKeyByHash(hash: string): Promise<string | null> {
  const result = await pool.query("SELECT user_id FROM api_keys WHERE hash=$1 AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > NOW())", [hash])
  if (!result.rows[0]) return null
  return result.rows[0].user_id;
}

