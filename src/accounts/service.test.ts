
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createAccount } from "./service.js"

vi.mock("./repository.js", () => ({
  saveAccount: vi.fn().mockResolvedValue({ id: "some-id", user_id: "some-user-id", account_name: "some-account-name", account_type: "checking", account_status: "active", account_currency: "USD", balance: 0 })
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


})
