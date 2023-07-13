import { LogErrorRepository } from "~/data/protocols/db/log-error-repository";
import { LogPgRepository } from "~/infra/database/postgresql/log-repository/log-repository";
import knexInstance from "~/main/config/knex";

export const makeDbLogErrorRepository = (): LogErrorRepository => {
  return new LogPgRepository(knexInstance);
};
