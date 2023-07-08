import { Knex } from "knex";

import { LogErrorRepository } from "~/data/protocols/db/log-error-repository";

export class LogPgRepository implements LogErrorRepository {
  constructor(private readonly knexInstance: Knex) {}

  public async logError(stack: string): Promise<void> {
    await this.knexInstance("errors").insert({ stack });
  }
}
