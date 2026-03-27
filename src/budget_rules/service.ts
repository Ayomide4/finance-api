import type { BudgetRuleType } from "../types.js";
import { addBudgetRule } from "./repository.js";

export async function createBudgetRule(accoundId: string): Promise<BudgetRuleType> {
  let res;

  try {
    res = await addBudgetRule()
    return res
  } catch (err) {
    console.error(err)
  }

}
