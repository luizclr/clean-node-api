import { LogPgRepository } from "~/infra/database/postgresql/log-repository/log-repository";

import { knexMem } from "#/infra/db/postgresql/helpers/postgresql-helper";

describe("Log PostgreSQL Repository", () => {
  beforeAll(async () => {
    await knexMem.migrate.latest();
  });

  afterAll(async () => {
    await knexMem.destroy();
  });

  it("should create an error log on success", async () => {
    // given
    const sut = new LogPgRepository(knexMem);
    const stack = "fake_error";

    // when
    await sut.logError(stack);
    const result = await knexMem("errors");

    // then
    expect(result.length).toBe(1);
    expect(result[0].stack).toBe(stack);
  });
});
