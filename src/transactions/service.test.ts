import { beforeEach, describe, expect, it, vi } from "vitest"
import { createTransaction, getAccountTransations, getTransaction } from "./service.js"
import { listAccountTransactions, getTransactionById } from "./repository.js"

vi.mock('./repository.js', () => ({
  saveTransaction: vi.fn().mockResolvedValue({
    user_id: "some-user-id",
    account_id: "some-account-id",
    category_id: "some-category-id",
    amount: 0,
    type: "some-transaction-type"
  }),
  listAccountTransactions: vi.fn().mockResolvedValue([
    {
      user_id: "some-user-id",
      account_id: "some-account-id",
      category_id: "some-category-id",
      amount: 0,
      type: "some-transaction-type"
    },
    {
      user_id: "some-user-id",
      account_id: "some-account-id",
      category_id: "some-category-id",
      amount: 0,
      type: "some-transaction-type"
    }
  ]),
  getTransactionById: vi.fn().mockResolvedValue({
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

describe("getAccountTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should throw error if no account id", async () => {
    await expect(getAccountTransations("", 2, 0)
    ).rejects.toThrow("Account id is required")
  })

  it("should throw error if transactions aren't found", async () => {
    vi.mocked(listAccountTransactions).mockResolvedValueOnce([])
    await expect(getAccountTransations("some-account-id", 2, 0)
    ).rejects.toThrow("No transactions found")
  })

  it("should return an array of Transactions", async () => {
    const res = await getAccountTransations("some-account-id", 2, 0)
    expect(res).toEqual([
      {
        user_id: "some-user-id",
        account_id: "some-account-id",
        category_id: "some-category-id",
        amount: 0,
        type: "some-transaction-type"
      },
      {
        user_id: "some-user-id",
        account_id: "some-account-id",
        category_id: "some-category-id",
        amount: 0,
        type: "some-transaction-type"
      }
    ])
  })
})

describe("getTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return single transaction obj", async () => {
    const res = await getTransaction("some-account-id", "some-transaction-id")
    expect(res).toEqual({
      user_id: "some-user-id",
      account_id: "some-account-id",
      category_id: "some-category-id",
      amount: 0,
      type: "some-transaction-type"
    })
  })

  it('should throw error if no account id', async () => {
    await expect(getTransaction("", "some-transaction-id")).rejects.toThrow("Account id is required")
  })

  it('should throw error if no transaction id', async () => {
    await expect(getTransaction("some-account-id", "")).rejects.toThrow("Transaction id is required")
  })

  it('should throw error if transaction not found', async () => {
    vi.mocked(getTransactionById).mockResolvedValueOnce(undefined)
    await expect(getTransaction("some-account-id", "some-transaction-id")).rejects.toThrow("No transaction found")
  })
})
