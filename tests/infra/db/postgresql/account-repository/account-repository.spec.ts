import { faker } from "@faker-js/faker";
import { IBackup } from "pg-mem";

import { AccountPgRepository } from "~/infra/database/postgresql/account-repository/account-repository";
import { AddAccountModel } from "~/domain/entities/account";

import {
  knexMem,
  pgMem,
} from "#/infra/db/postgresql/helpers/postgresql-helper";

// eslint-disable-next-line max-lines-per-function
describe("Account PostgreSQL Repository", () => {
  let backup: IBackup;
  const fakeJwt = faker.string.alphanumeric(20);
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

  describe("updateToken", () => {
    it("should update the account on updateAccessToken success", async () => {
      // given
      const sut = new AccountPgRepository(knexMem);
      const [{ id }] = await knexMem("accounts")
        .insert(addAccount)
        .returning(["id"]);

      // when
      await sut.updateToken(id, fakeJwt);
      const { accessToken } = await knexMem("accounts")
        .first()
        .select("accessToken")
        .where("id", id);

      // then
      expect(accessToken).toBe(fakeJwt);
    });
  });

  describe("getAll", () => {
    it("should return an empty array if there are no items saved", async () => {
      // given
      const sut = new AccountPgRepository(knexMem);

      // when
      const accounts = await sut.getAll();

      // then
      expect(accounts.length).toEqual(0);
    });

    it("should return a list pf accounts on success", async () => {
      // given
      const sut = new AccountPgRepository(knexMem);
      await knexMem("accounts").insert(addAccount);

      // when
      const accounts = await sut.getAll();

      // then
      expect(accounts.length).toBeTruthy();
      expect(accounts[0].id).toBeTruthy();
      expect(accounts[0].name).toBe(name);
      expect(accounts[0].email).toBe(email);
    });
  });

  describe("getById", () => {
    it("should return an account on success", async () => {
      // given
      const sut = new AccountPgRepository(knexMem);
      const [savedAccount] = await knexMem("accounts")
        .insert(addAccount)
        .returning(["id", "name", "email"]);

      // when
      const account = await sut.getById(savedAccount.id);

      // then
      expect(account.id).toBe(savedAccount.id);
      expect(account.name).toBe(savedAccount.name);
      expect(account.email).toBe(savedAccount.email);
    });

    it("should return undefined if getById fails", async () => {
      // given
      const sut = new AccountPgRepository(knexMem);
      const fakeId = faker.string.uuid();

      // when
      const account = await sut.getById(fakeId);

      // then
      expect(account).toBeUndefined();
    });
  });
});
