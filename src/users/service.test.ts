import { beforeEach, describe, expect, it, vi } from "vitest"
import { createUser } from "./service.js"

vi.mock('./repository.js', () => ({
  saveUser: vi.fn().mockResolvedValue({ id: "some-user-id", email: 'test@gmail.com' }) // pretend the db succeeded and return a fake user obj
}))

describe('createUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return error if no email', async () => {
    await expect(createUser('')).rejects.toThrow('user email is required')
  })

  it('should return user obj on success', async () => {
    const result = await createUser('test@gmail.com')
    expect(result).toEqual({ id: "some-user-id", email: "test@gmail.com" })
  })

  it('should return error if email is invalid', async () => {
    await expect(createUser('testgmail.com')).rejects.toThrow('user email is invalid')
  })
})
