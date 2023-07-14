import { DbGetAccountById } from "~/data/use-cases/get-account-by-id/db-get-account-by-id";
import { GetAccountById } from "~/domain/use-cases/get-account-by-id/get-accounts-by-id";
import { AccountPgRepository } from "~/infra/database/postgresql/account-repository/account-repository";
import knexInstance from "~/main/config/knex";

export const makeDbGetAccountById = (): GetAccountById => {
  const accountPgRepository = new AccountPgRepository(knexInstance);

  return new DbGetAccountById(accountPgRepository);
};
