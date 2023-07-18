import { UUIDValidator } from "~/data/protocols/validators/uuid-validator";

const makeUUIDValidator = (): UUIDValidator => {
  class UUIDValidatorStub implements UUIDValidator {
    isValid(_uuid: string): boolean {
      return true;
    }
  }

  return new UUIDValidatorStub();
};

export default makeUUIDValidator;
