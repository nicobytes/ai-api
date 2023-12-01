import app from "@src/index";
import { test, expect, describe } from "vitest";

describe("Example", () => {
  test("GET /posts", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello!");
  });
});
