import { IBackup } from "pg-mem";
import request from "supertest";

import app from "~/main/config/app";

import {
  knexMem,
  pgMem,
} from "#/infra/db/postgresql/helpers/postgresql-helper";

describe("Accounts routes", () => {
  let backup: IBackup;
  beforeAll(async () => {
    await knexMem.migrate.latest();
    await knexMem.seed.run();
    backup = pgMem.backup();
  });

  beforeEach(() => {
    backup.restore();
  });

  afterAll(async () => {
    await knexMem.destroy();
  });

  describe("GET /accounts", () => {
    it("should return 200 on get accounts", async () => {
      await request(app).get("/api/accounts").expect(200);
    });
  });
});
