import { faker } from "@faker-js/faker";
import validator from "validator";

import { UUIDValidatorAdapter } from "~/infra/validators/uuid-validator-adapter";

jest.mock("validator", () => ({
  isUUID(): boolean {
    return true;
  },
}));

describe("UUIDValidator Adapter", () => {
  it("should call validator with correct UUID", () => {
    // given
    const sut = new UUIDValidatorAdapter();
    const isUUIDSpy = jest.spyOn(validator, "isUUID");
    const uuid = faker.string.uuid();

    // when
    sut.isValid(uuid);

    // then
    expect(isUUIDSpy).toHaveBeenCalledWith(uuid);
  });

  it("should return false if validator returns false", () => {
    // given
    const sut = new UUIDValidatorAdapter();
    jest.spyOn(validator, "isUUID").mockReturnValueOnce(false);

    // when
    const isValid = sut.isValid(faker.string.alphanumeric(20));

    // then
    expect(isValid).toBe(false);
  });

  it("should return true if validator returns true", () => {
    // given
    const sut = new UUIDValidatorAdapter();

    // when
    const isValid = sut.isValid(faker.string.uuid());

    // then
    expect(isValid).toBe(true);
  });
});
