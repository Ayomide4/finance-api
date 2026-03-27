import { Hono } from "hono";
import type { Variables } from "../types.js";

const budgetRules = new Hono<{ Variables: Variables }>()



budgetRules.post()

budgetRules.get()

budgetRules.patch()

