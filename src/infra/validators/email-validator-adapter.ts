import validator from "validator";

import { EmailValidator } from "~/data/protocols/validators/email-validator";

export class EmailValidatorAdapter implements EmailValidator {
  public isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
