import { EmailValidator } from "~/presentation/protocols/email-validator";

const makeEmailValidator = (isValid = true): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return isValid;
    }
  }

  return new EmailValidatorStub();
};

export default makeEmailValidator;
