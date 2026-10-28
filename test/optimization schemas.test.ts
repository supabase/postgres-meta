import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { build } from "../src/server/app.js";
import { TEST_CONNECTION_STRING } from "./lib/utils.js";

let app;

const inject = (options) =>
  app.inject({
    headers: { pg: TEST_CONNECTION_STRING },
    ...options,
  });

beforeAll(async () => {
  app = build();
});

afterAll(async () => {
  await app.close();
});

describe("server/routes/schemas", () => {
  test("GET /schemas → list schemas", async () => {
    const res = await inject({ method: "GET", url: "/schemas" });

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("application/json");
    expect(Array.isArray(res.json())).toBe(true);
  });

  test("GET /schemas with query params", async () => {
    const res = await inject({
      method: "GET",
      url: "/schemas?include_system_schemas=true&limit=5&offset=0",
    });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json())).toBe(true);
  });

  test("GET /schemas/:id → 404 when missing", async () => {
    const res = await inject({
      method: "GET",
      url: "/schemas/non-existent-schema",
    });

    expect(res.statusCode).toBe(404);
  });

  test("CRUD /schemas lifecycle", async () => {
    // ---- CREATE ----
    const createRes = await inject({
      method: "POST",
      url: "/schemas",
      payload: { name: "test_schema" },
    });

    expect(createRes.statusCode).toBe(200);

    const created = createRes.json();
    expect(created).toMatchObject({
      id: expect.any(Number),
      name: "test_schema",
      owner: "postgres",
    });

    const { id } = created;

    // ---- READ ----
    const getRes = await inject({
      method: "GET",
      url: `/schemas/${id}`,
    });

    expect(getRes.statusCode).toBe(200);
    expect(getRes.json()).toMatchObject(created);

    // ---- UPDATE ----
    const updateRes = await inject({
      method: "PATCH",
      url: `/schemas/${id}`,
      payload: { name: "test_schema_updated" },
    });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.json()).toMatchObject({
      id,
      name: "test_schema_updated",
      owner: "postgres",
    });

    // ---- DELETE ----
    const deleteRes = await inject({
      method: "DELETE",
      url: `/schemas/${id}`,
    });

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.json()).toMatchObject({
      id,
      name: "test_schema_updated",
      owner: "postgres",
    });
  });

  test("POST /schemas → invalid payload", async () => {
    const res = await inject({
      method: "POST",
      url: "/schemas",
      payload: { name: "pg_" },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({
      error: 'unacceptable schema name "pg_"',
    });
  });
});
