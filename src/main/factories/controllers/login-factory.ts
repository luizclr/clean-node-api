import { EmailValidatorAdapter } from "~/infra/validators/email-validator-adapter";
import { LogControllerDecorator } from "~/main/decorators/log-decorator/log-controller";
import { makeDbLogErrorRepository } from "~/main/factories/protocols/log-error-repository/db-log-error-repository-factory";
import { makeDbAuthentication } from "~/main/factories/use-cases/authentication/db-authentication-factory";
import { LoginController } from "~/presentation/controllers/auth/login/login-controller";
import { Controller } from "~/presentation/protocols/controller";

export const makeLoginController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter();
  const dbAuthentication = makeDbAuthentication();
  const signupController = new LoginController(
    emailValidator,
    dbAuthentication
  );
  const logPgRepository = makeDbLogErrorRepository();

  return new LogControllerDecorator(signupController, logPgRepository);
};
