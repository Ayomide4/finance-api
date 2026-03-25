import { beforeEach, describe, expect, it, vi } from "vitest"
import { createCatetgory } from "./service.js"

vi.mock("./repository.js", () => ({
  saveCategory: vi.fn().mockResolvedValue({
    id: "some-id",
    user_id: "some-user-id",
    name: "some-name",
    color: "some-color"
  })
}))

describe("createCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("return category on success", async () => {
    const res = await createCatetgory("some-user-id", "some-name")
    expect(res).toEqual({
      id: "some-id",
      user_id: "some-user-id",
      name: "some-name",
      color: "some-color"
    })
  })

  it("throw if no userId", async () => {
    await expect(createCatetgory("", "some-name")).rejects.toThrow("User id is required")
  })

  it("throw if no name", async () => {
    await expect(createCatetgory("some-user-id", "")).rejects.toThrow("Category name is required")
  })
})
