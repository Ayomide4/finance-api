import { beforeEach, describe, expect, it, vi } from "vitest"
import { createAccount, deleteAccount, getAccount, listAccountsWithBalance, updateAccountName } from "./service.js"
import type { Account } from "../types.js"
import { getAccountById, listAccountsByUser } from "./repository.js"


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
  getAccountById: vi.fn().mockResolvedValue({ id: "some-id", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 250.1 },
  )
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

describe("getAccount", async () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return account with balance on success", async () => {
    const res = await getAccount('some-user-id', 'some-account-id')
    expect(res).toEqual(
      { id: "some-id", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 250.1 },
    )
  })

  it("should throw if the account does not exist or user doesn't own it", async () => {
    vi.mocked(getAccountById).mockResolvedValue(null);

    await expect(getAccount("user-1", "fake-acc"))
      .rejects.toThrow("Account not found");
  });
})

describe("getAccountsWithBalance", async () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })



  it("should return list of accounts with balance", async () => {
    const response = await listAccountsWithBalance("some-user-id", 2, 0)

    expect(response).toEqual([
      { id: "some-id", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 0 },
      { id: "some-id-2", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 0 },
    ])
  })

  it("should return an empty array if the user has no accounts", async () => {
    vi.mocked(listAccountsByUser).mockResolvedValue([]);

    const response = await listAccountsWithBalance("user-with-no-money", 10, 0);
    expect(response).toEqual([]);
  });
})

