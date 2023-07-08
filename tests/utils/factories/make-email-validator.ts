import { EmailValidator } from "~/presentation/protocols/email-validator";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

export default makeEmailValidator;
