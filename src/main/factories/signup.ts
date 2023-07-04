import { DbAddAccount } from "~/data/usecases/db-add-account";
import { BcryptAdapter } from "~/infra/criptography/bcrypt-adapter";
import { AccountPgRepository } from "~/infra/database/postgresql/account-repository/account-repository";
import knexInstance from "~/main/config/knex";
import { LogControllerDecorator } from "~/main/decorators/log-decorator/log-controller";
import SignupController from "~/presentation/controllers/signup-controller";
import { Controller } from "~/presentation/protocols/controller";
import { EmailValidatorAdapter } from "~/utils/email-validator-adapter";

export const makeSignUpController = (): Controller => {
  const SALT = 12;
  const emailValidator = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(SALT);
  const accountPgRepository = new AccountPgRepository(knexInstance);
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountPgRepository);
  const signupController = new SignupController(emailValidator, dbAddAccount);

  return new LogControllerDecorator(signupController);
};
