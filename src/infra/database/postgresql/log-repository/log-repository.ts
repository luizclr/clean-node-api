import { Knex } from "knex";

import { LogErrorRepository } from "~/data/protocols/log-error-repository";

export class LogPgRepository implements LogErrorRepository {
  private knexInstance: Knex;

  constructor(knexInstance: Knex) {
    this.knexInstance = knexInstance;
  }

  public async logError(stack: string): Promise<void> {
    await this.knexInstance("errors").insert({ stack });
  }
}
