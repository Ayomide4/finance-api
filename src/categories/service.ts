import type { Category } from "../types.js"
import { saveCategory } from "./repository.js"

export async function createCatetgory(userId: string, name: string): Promise<Category> {
  if (!userId) {
    throw new Error("User id is required")
  }

  if (!name) {
    throw new Error("Category name is required")
  }

  try {
    const res: Category = await saveCategory(userId, name)
    return res
  } catch (err) {
    console.error("Error creating category")
    throw new Error("Error creating category, try again")
  }

}
