import type { PoolClient } from "pg";
import { pool } from "../db/index.js";
import type { AuditActionType } from "../types.js";

export async function saveAuditLog(
  userId: string | null,
  entityType: string,
  entityId: string,
  action: AuditActionType,
  oldValues: Record<string, any> | null,
  newValues: Record<string, any>,
  ipAddress: string,
  client?: PoolClient
) {
  const db = client || pool; //so we can add it to rollback queries
  const query = "INSERT INTO audit_logs (user_id, entity_type, entity_id, action, old_values, new_values, ip_address) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *"
  const values = [
    userId,
    entityType,
    entityId,
    action,
    oldValues,
    newValues,
    ipAddress
  ];

  const res = await db.query(query, values)
  return res.rows[0]
}
