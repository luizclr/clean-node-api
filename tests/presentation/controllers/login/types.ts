import { Authentication } from "~/domain/use-cases/authentication/authentication";
import { LoginController } from "~/presentation/controllers/login/login-controller";
import { EmailValidator } from "~/data/protocols/validators/email-validator";

export type MakeSutType = {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
};
