import type { AuditActionType } from "../types.js";
import { saveAuditLog } from "./repository.js";

export async function createAuditLog(
  userId: string,
  entityType: string,
  entityId: string,
  action: AuditActionType,
  oldValues: Record<string, any> | null,
  newValues: Record<string, any>,
  ipAddress: string,
) {

  let res;

  try {
    res = await saveAuditLog(userId, entityType, entityId, action, oldValues, newValues, ipAddress)
  } catch (err) {
    console.error("Database error while creating audit log", err)
    throw new Error("Database Error")
  }

  if (!res) {
    throw new Error("Failed to create audit log")
  }
  return { success: true, id: res.id }
}
