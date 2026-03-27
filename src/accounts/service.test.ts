import { beforeEach, describe, expect, it, vi } from "vitest"
import { createAccount, deleteAccount, getAccountTransations, listAccountsWithBalance, updateAccountName } from "./service.js"
import type { Account } from "../types.js"
import { listAccountTransactions } from "./repository.js"


const { mockAccount, mockAccountActive } = vi.hoisted(() => ({
  mockAccount: {
    id: "some-id",
    user_id: "some-user-id",
    account_name: "some-account-name",
    account_type: "checking",
    account_status: "closed",
    currency: "USD"
  } as Account,
  mockAccountActive: {
    id: "some-id",
    user_id: "some-user-id",
    account_name: "some-account-name",
    account_type: "checking",
    account_status: "active",
    currency: "USD"
  } as Account
}))

vi.mock("./repository.js", () => ({
  saveAccount: vi.fn().mockResolvedValue({ id: "some-id", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 0 }),
  listAccountsByUser: vi.fn().mockResolvedValue([
    { id: "some-id", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 0 },
    { id: "some-id-2", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 0 },
  ]),
  changeAccountName: vi.fn().mockResolvedValue({ id: "some-id", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 0 }),
  deleteAccountById: vi.fn().mockResolvedValue(mockAccount),
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
  ])
}))

describe("createAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return account obj on success", async () => {
    const response = await createAccount("some-user-id", "Test", "checking")
    expect(response).toEqual({ id: "some-id", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 0 })
  })

  it("should throw if userId is missing", async () => {
    await expect(createAccount("", "Test", "checking")).rejects.toThrow("user id is required")
  })

  it("should return list of accounts with balance", async () => {
    const response = await listAccountsWithBalance("some-user-id", 2, 0)

    expect(response).toEqual([
      { id: "some-id", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 0 },
      { id: "some-id-2", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 0 },
    ])
  })

  it("should return account on update account_name", async () => {
    const res = await updateAccountName("some-user-id", "some-account-name", "some-account-id")
    expect(res).toEqual({ id: "some-id", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 0 })
  })

  it('should return updated account on delete request', async () => {
    const res = await deleteAccount('some-user-id', 'some-account-id')
    expect(res).toEqual({ id: "some-id", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "closed", currency: "USD" })
  })
})

// TODO: seperate describe into correct functions

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


