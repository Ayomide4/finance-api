import { beforeEach, describe, expect, it, vi } from "vitest"
import { createTransaction } from "./service.js"

vi.mock('./repository.js', () => ({
  saveTransaction: vi.fn().mockResolvedValue({
    user_id: "some-user-id",
    account_id: "some-account-id",
    category_id: "some-category-id",
    amount: 0,
    type: "some-transaction-type"
  })
}))

describe("createTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return transaction on success", async () => {
    const res = await createTransaction("some-user-id", 'some-account-id', 'some-category-id', 0, 'credit')
    expect(res).toEqual({
      user_id: "some-user-id",
      account_id: "some-account-id",
      category_id: "some-category-id",
      amount: 0,
      type: "some-transaction-type"
    })
  })

  it("should throw error if no userId", async () => {
    await expect(createTransaction("", 'some-account-id', 'some-category-id', 0, 'credit')).rejects.toThrow("User id is required")
  })
})
