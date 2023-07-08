import { faker } from "@faker-js/faker";
import { IBackup } from "pg-mem";

import { AccountPgRepository } from "~/infra/database/postgresql/account-repository/account-repository";
import { AddAccountModel } from "~/domain/entities/account";

import {
  knexMem,
  pgMem,
} from "#/infra/db/postgresql/helpers/postgresql-helper";

describe("Account PostgreSQL Repository", () => {
  let backup: IBackup;
  const name = faker.person.firstName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const addAccount: AddAccountModel = {
    name,
    email,
    password,
  };

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

  describe("add", () => {
    it("should return account on success", async () => {
      // given
      const sut = new AccountPgRepository(knexMem);

      // when
      const account = await sut.add(addAccount);

      // then
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
    });
  });

  describe("getByEmail", () => {
    it("should return account on success", async () => {
      // given
      const sut = new AccountPgRepository(knexMem);
      await knexMem("accounts").insert(addAccount);

      // when
      const account = await sut.getByEmail(email);

      // then
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
      expect(account.password).toBe(password);
    });

    it("should return undefined if getByEmail fails", async () => {
      // given
      const sut = new AccountPgRepository(knexMem);

      // when
      const account = await sut.getByEmail(email);

      // then
      expect(account).toBeUndefined();
    });
  });
});
