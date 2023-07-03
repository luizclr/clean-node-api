import { DbAddAccount } from "~/data/usecases/db-add-account";
import { BcryptAdapter } from "~/infra/criptography/bcrypt-adapter";
import { AccountPgRepository } from "~/infra/database/postgresql/account-repository/account-repository";
import knexInstance from "~/main/config/knex";
import SignupController from "~/presentation/controllers/signup-controller";
import { EmailValidatorAdapter } from "~/utils/email-validator-adapter";

export const makeSignUpController = (): SignupController => {
  const SALT = 12;
  const emailValidator = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(SALT);
  const accountPgRepository = new AccountPgRepository(knexInstance);
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountPgRepository);

  return new SignupController(emailValidator, dbAddAccount);
};
