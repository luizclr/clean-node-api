import { DbGetAccounts } from "~/data/use-cases/get-accounts/db-get-accounts";
import { GetAccounts } from "~/domain/use-cases/get-accounts/get-accounts";
import { AccountPgRepository } from "~/infra/database/postgresql/account-repository/account-repository";
import knexInstance from "~/main/config/knex";

export const makeDbGetAccounts = (): GetAccounts => {
  const accountPgRepository = new AccountPgRepository(knexInstance);

  return new DbGetAccounts(accountPgRepository);
};
