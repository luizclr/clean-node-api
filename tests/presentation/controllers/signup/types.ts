import { AddAccount } from "~/domain/use-cases/add-account/add-account";
import SignupController from "~/presentation/controllers/signup/signup-controller";
import { EmailValidator } from "~/presentation/protocols/email-validator";

export type sutTypes = {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
};
