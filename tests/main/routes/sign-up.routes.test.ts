import { Response } from "express";
import { IBackup } from "pg-mem";
import request from "supertest";

import app from "~/main/config/app";

import {
  knexMem,
  pgMem,
} from "#/infra/db/postgresql/helpers/postgresql-helper";

describe("SignUp routes", () => {
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

  it("should return an account on success", async () => {
    app.get("/test", (_, res: Response) => {
      res.send();
    });

    await request(app)
      .post("/signup")
      .send({
        name: "Will Smith",
        email: "will.smith@email.com",
        password: "123",
        passwordConfirmation: "123",
      })
      .expect(200);
  });
});
