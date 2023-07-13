import { DbAddAccount } from "~/data/use-cases/add-account/db-add-account";
import { AddAccount } from "~/domain/use-cases/add-account/add-account";
import { BcryptAdapter } from "~/infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { AccountPgRepository } from "~/infra/database/postgresql/account-repository/account-repository";
import knexInstance from "~/main/config/knex";

export const makeDbAddAccount = (): AddAccount => {
  const SALT = 12;
  const bcryptAdapter = new BcryptAdapter(SALT);
  const accountPgRepository = new AccountPgRepository(knexInstance);

  return new DbAddAccount(
    bcryptAdapter,
    accountPgRepository,
    accountPgRepository
  );
};
