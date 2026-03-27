import { Hono } from "hono"
import type { Variables } from "../types.js"

export const auditLog = new Hono<{ Variables: Variables }>


