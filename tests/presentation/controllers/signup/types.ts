import { AddAccount } from "~/domain/use-cases/add-account/add-account";
import { Authentication } from "~/domain/use-cases/authentication/authentication";
import SignupController from "~/presentation/controllers/signup/signup-controller";
import { EmailValidator } from "~/presentation/protocols/email-validator";

export type sutTypes = {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  authenticationStub: Authentication;
};
