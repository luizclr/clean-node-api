import { IBackup } from "pg-mem";
import request from "supertest";

import app from "~/main/config/app";

import {
  knexMem,
  pgMem,
} from "#/infra/db/postgresql/helpers/postgresql-helper";

describe("Login routes", () => {
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

  describe("POST /signup", () => {
    it("should return 200 on signup", async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "Will Smith",
          email: "will.smith@email.com",
          password: "123",
          passwordConfirmation: "123",
        })
        .expect(200);
    });
  });

  describe("POST /login", () => {
    it("should return 200 on login", async () => {
      await request(app)
        .get("/api/login")
        .send({
          email: "user1@email.com",
          password: "123",
        })
        .expect(200);
    });
  });
});
