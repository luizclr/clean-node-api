import { IBackup } from "pg-mem";
import request from "supertest";
import { faker } from "@faker-js/faker";

import app from "~/main/config/app";
import { AddAccountModel } from "~/domain/entities/account";

import {
  knexMem,
  pgMem,
} from "#/infra/db/postgresql/helpers/postgresql-helper";

describe("Accounts routes", () => {
  const name = faker.person.firstName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const addAccount: AddAccountModel = {
    name,
    email,
    password,
  };
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

  describe("GET /account/:id", () => {
    it("should return 404 if account not found", async () => {
      // given
      const id = faker.string.uuid();

      // then
      await request(app).get(`/api/accounts/${id}`).expect(404);
    });

    it("should return 200 with an account on get account by id", async () => {
      // given
      const [{ id }] = await knexMem("accounts")
        .insert(addAccount)
        .returning(["id"]);

      // then
      await request(app).get(`/api/accounts/${id}`).expect(200);
    });
  });
});
