import { beforeEach, describe, expect, it, vi } from "vitest"
import { generateApiKey, revokeApiKey } from "./service.js"
import { createApiKey, revokeApiKeyByHash } from "./repository.js"

vi.mock('./repository.js', () => ({
  createApiKey: vi.fn().mockResolvedValue({ id: "some-user-id" }),
  revokeApiKeyByHash: vi.fn().mockResolvedValue({
    id: "some-id",
    user_id: "some-user-id",
    name: "some-name",
    prefix: "some-prefix",
    hash: "some-hash",
    revoked_at: "some-timestamp",
    expires_at: "some-timestamp",
  })
}))

describe('generateApiKey', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a 64 character raw api key', async () => {
    const result = await generateApiKey("some-user-id")
    expect(result).toHaveLength(64)
  })

  it('should call createApiKey with a 64 character hash', async () => {
    await generateApiKey("some-user-id") // run generateApiKey
    const calledWithHash = (createApiKey as ReturnType<typeof vi.fn>).mock.calls[0][1] // we're type casting createApiKey as a vitest mock fn so we can access the mock calls. Mock calls lets us get the func call [0] and its arguements [0][0->3 because we have 4 arguements, index 1 is our hash]
    expect(calledWithHash).toHaveLength(64) //check if our hash has length 64
  })

  it('return error if no user id', async () => {
    await expect(generateApiKey('')).rejects.toThrow('User id is required')
  })
})

describe("revokeApiKey", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('return error if no user id', async () => {
    await expect(revokeApiKey('some-api-key', "")).rejects.toThrow('User id is required')
  })

  it('return error if no raw api key', async () => {
    await expect(revokeApiKey('', "some-user-id")).rejects.toThrow('Api key is required')
  })

  it("return API Key obj on success", async () => {
    const res = await revokeApiKey("some-api-key", "some-user-id")
    expect(res).toEqual({
      id: "some-id",
      user_id: "some-user-id",
      name: "some-name",
      prefix: "some-prefix",
      hash: "some-hash",
      revoked_at: "some-timestamp",
      expires_at: "some-timestamp",
    })
  })

  it("should throw a failed to find api key if hash does not exist", async () => {
    vi.mocked(revokeApiKeyByHash).mockResolvedValue(undefined)

    await expect(revokeApiKey("some-api-key", "some-user-id"))
      .rejects
      .toThrow("API key not found or already revoked")
  })
})
