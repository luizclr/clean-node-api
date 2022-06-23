import { EmailValidatorAdapter } from "../../src/utils/email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe("EmailValidator Adapter", () => {
  it("should return false if validator returns false", () => {
    // given
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);

    // when
    const isValid = sut.isValid("invalidemail@test.com");

    // then
    expect(isValid).toBe(false);
  });

  it("should return false if validator returns true", () => {
    // given
    const sut = new EmailValidatorAdapter();

    // when
    const isValid = sut.isValid("validemail@test.com");

    // then
    expect(isValid).toBe(true);
  });

  it("should call validator with correct e-mail", () => {
    // given
    const sut = new EmailValidatorAdapter();
    const isEmailSpy = jest.spyOn(validator, "isEmail");

    // when
    sut.isValid("validemail@test.com");

    // then
    expect(isEmailSpy).toHaveBeenCalledWith("validemail@test.com");
  });
});
