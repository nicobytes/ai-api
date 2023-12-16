import app from "@src/index";
import { test, expect, describe } from "vitest";

describe("Hello ", () => {
  test("GET /", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello!");
  });
});
