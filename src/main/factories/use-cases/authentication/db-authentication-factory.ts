import { DbAuthentication } from "~/data/use-cases/authentication/db-authentication";
import { Authentication } from "~/domain/use-cases/authentication/authentication";
import { BcryptAdapter } from "~/infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { JWTAdapter } from "~/infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountPgRepository } from "~/infra/database/postgresql/account-repository/account-repository";
import knexInstance from "~/main/config/knex";

export const makeDbAuthentication = (): Authentication => {
  const SALT = 12;
  const SECRET = process.env.JWT_SECRET;
  const bcryptAdapter = new BcryptAdapter(SALT);
  const accountPgRepository = new AccountPgRepository(knexInstance);
  const jwtAdapter = new JWTAdapter(SECRET);
  const dbAuthentication = new DbAuthentication(
    accountPgRepository,
    bcryptAdapter,
    jwtAdapter,
    accountPgRepository
  );

  return dbAuthentication;
};
