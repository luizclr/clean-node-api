import { StatusCodes } from "http-status-codes";
import { InvalidParamError, MissingParamError, ServerError } from "../errors";
import { EmailValidator } from "../protocols/email-validator";
import { HttpRequest } from "../protocols/http";
import SignupController from "./signup-controller";

type sutTypes = {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): sutTypes => {
  const emailValidatorStub = makeEmailValidator();

  return {
    sut: new SignupController(emailValidatorStub),
    emailValidatorStub,
  };
};

describe("Signup Controller", () => {
  it("should return 400 if no name is not provided", () => {
    // given
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };

    // when
    const httpResponse = sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  it("should return 400 if no e-mail is not provided", () => {
    // given
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        password: "password",
        passwordConfirmation: "password",
      },
    };

    // when
    const httpResponse = sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  it("should return 400 if password is not provided", () => {
    // given
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        passwordConfirmation: "password",
      },
    };

    // when
    const httpResponse = sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  it("should return 400 if password confirmation is not provided", () => {
    // given
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
      },
    };

    // when
    const httpResponse = sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"));
  });

  it("should return 400 if e-mail is not valid", () => {
    // given
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    // when
    const httpResponse = sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  it("should call EmailValidator with correct e-mail", () => {
    // given
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    // when
    sut.handle(httpRequest);

    // then
    expect(isValidSpy).toHaveBeenCalledWith("email@email.com");
  });

  it("should return 500 if EmailValidator throws an error", () => {
    // given
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new ServerError();
    });
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };

    // when
    const httpResponse = sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
