import request from "supertest";

import app from "~/main/config/app";

import { knexMem } from "#/infra/db/postgresql/helpers/postgresql-helper";

describe("Index routes - Database connection", () => {
  beforeAll(async () => {
    await knexMem.migrate.latest();
  });

  afterAll(async () => {
    await knexMem.destroy();
  });

  describe("GET /", () => {
    it("should return 200 on get accounts", async () => {
      await request(app).get("/api").expect(200);
    });
  });
});
