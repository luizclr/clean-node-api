import { Authentication } from "~/domain/use-cases/authentication/authentication";
import { LoginController } from "~/presentation/controllers/auth/login/login-controller";
import { EmailValidator } from "~/data/protocols/validators/email-validator";

export type MakeSutType = {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
};
