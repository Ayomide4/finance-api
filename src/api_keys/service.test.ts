import { beforeEach, describe, expect, it, test, vi } from "vitest"
import { generateApiKey } from "./service.js"
import { createApiKey } from "./repository.js"


// todo: prefix, raw key, if usedId exists, 

vi.mock('./repository.js', () => ({
  createApiKey: vi.fn().mockResolvedValue({ id: "some-user-id" })
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
    await expect(generateApiKey('')).rejects.toThrow('user id is required')
  })

})
