import { DbAddAccount } from "~/data/use-cases/add-account/db-add-account";
import { BcryptAdapter } from "~/infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { AccountPgRepository } from "~/infra/database/postgresql/account-repository/account-repository";
import { LogPgRepository } from "~/infra/database/postgresql/log-repository/log-repository";
import knexInstance from "~/main/config/knex";
import { LogControllerDecorator } from "~/main/decorators/log-decorator/log-controller";
import SignupController from "~/presentation/controllers/signup/signup-controller";
import { Controller } from "~/presentation/protocols/controller";
import { EmailValidatorAdapter } from "~/utils/email-validator-adapter";

export const makeSignUpController = (): Controller => {
  const SALT = 12;
  const emailValidator = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(SALT);
  const accountPgRepository = new AccountPgRepository(knexInstance);
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountPgRepository);
  const signupController = new SignupController(emailValidator, dbAddAccount);
  const logPgRepository = new LogPgRepository(knexInstance);

  return new LogControllerDecorator(signupController, logPgRepository);
};
