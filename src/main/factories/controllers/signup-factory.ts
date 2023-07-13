import { EmailValidatorAdapter } from "~/main/adapters/validators/email-validator-adapter";
import { LogControllerDecorator } from "~/main/decorators/log-decorator/log-controller";
import { makeDbLogErrorRepository } from "~/main/factories/protocols/log-error-repository/db-log-error-repository-factory";
import { makeDbAddAccount } from "~/main/factories/use-cases/add-account/db-add-account-factory";
import { makeDbAuthentication } from "~/main/factories/use-cases/authentication/db-authentication-factory";
import SignupController from "~/presentation/controllers/signup/signup-controller";
import { Controller } from "~/presentation/protocols/controller";

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter();
  const dbAddAccount = makeDbAddAccount();
  const dbAuthentication = makeDbAuthentication();
  const signupController = new SignupController(
    emailValidator,
    dbAddAccount,
    dbAuthentication
  );
  const logPgRepository = makeDbLogErrorRepository();

  return new LogControllerDecorator(signupController, logPgRepository);
};
