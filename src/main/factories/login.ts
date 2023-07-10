import { DbAuthentication } from "~/data/use-cases/authentication/db-authentication";
import { BcryptAdapter } from "~/infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { JWTAdapter } from "~/infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountPgRepository } from "~/infra/database/postgresql/account-repository/account-repository";
import { LogPgRepository } from "~/infra/database/postgresql/log-repository/log-repository";
import { EmailValidatorAdapter } from "~/main/adapters/validators/email-validator-adapter";
import knexInstance from "~/main/config/knex";
import { LogControllerDecorator } from "~/main/decorators/log-decorator/log-controller";
import { LoginController } from "~/presentation/controllers/login/login-controller";
import { Controller } from "~/presentation/protocols/controller";

export const makeLoginController = (): Controller => {
  const SALT = 12;
  const SECRET = process.env.JWT_SECRET;
  const emailValidator = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(SALT);
  const accountPgRepository = new AccountPgRepository(knexInstance);
  const jwtAdapter = new JWTAdapter(SECRET);
  const dbAuthentication = new DbAuthentication(
    accountPgRepository,
    bcryptAdapter,
    jwtAdapter,
    accountPgRepository
  );
  const signupController = new LoginController(
    emailValidator,
    dbAuthentication
  );
  const logPgRepository = new LogPgRepository(knexInstance);

  return new LogControllerDecorator(signupController, logPgRepository);
};
