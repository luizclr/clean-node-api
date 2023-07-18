import validator from "validator";

import { UUIDValidator } from "~/data/protocols/validators/uuid-validator";

export class UUIDValidatorAdapter implements UUIDValidator {
  public isValid(id: string): boolean {
    return validator.isUUID(id);
  }
}
