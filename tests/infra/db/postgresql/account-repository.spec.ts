import { faker } from "@faker-js/faker";
import { newDb } from "pg-mem";
import { AccountPgRepository } from "~/infra/database/postgresql/account-repository";

describe("Account PostgreSQL Repository", () => {
  beforeAll(() => {
    const db = newDb();
    db.public.none(`
      CREATE TABLE test(id text, name varchar(10));
      INSERT INTO test values ('1', 'Luiz');
      INSERT INTO test values ('2', 'Dina');
    `);

    const data = db.public.many(`select * from test`);

    console.log(data);
  });

  it.skip("should return account on success", async () => {
    // given
    const sut = new AccountPgRepository();
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    // when
    const account = await sut.add({ name, email, password });

    // then
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(name);
    expect(account.email).toBe(email);
    expect(account.password).toBe(password);
  });
});
