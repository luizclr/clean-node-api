import { faker } from "@faker-js/faker";
import { knexMem } from "#/infra/db/postgresql/helpers/postgresql-helper";
import { AccountPgRepository } from "~/infra/database/postgresql/account-repository/account-repository";

describe("Account PostgreSQL Repository", () => {
  beforeAll(async () => {
    await knexMem.migrate.latest();
    await knexMem.seed.run();
  });

  afterAll(async () => {
    await knexMem.destroy();
  });

  it("should return account on success", async () => {
    // given
    const sut = new AccountPgRepository(knexMem);
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    // when
    const account = await sut.add({ name, email, password });

    // then
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(name);
    expect(account.email).toBe(email);
  });
});
