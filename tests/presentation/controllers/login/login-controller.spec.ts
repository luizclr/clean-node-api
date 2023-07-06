import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";

import { LoginController } from "~/presentation/controllers/login/login-controller";
import { InvalidParamError, MissingParamError } from "~/presentation/errors";
import { badRequest } from "~/presentation/helpers/http-helper";
import { HttpRequest } from "~/presentation/protocols/http";
import { EmailValidator } from "~/presentation/protocols/email-validator";

import makeEmailValidator from "#/test-utils/make-email-validator";

type MakeSutType = {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
};

const makeSut = (): MakeSutType => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);

  return { sut, emailValidatorStub };
};

const makeHttpRequest = (): HttpRequest => {
  const httpRequest: HttpRequest = {
    body: {
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  };

  return httpRequest;
};

describe("Login Controller", () => {
  it("should return 400 if no e-mail is not provided", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();
    delete httpRequest.body.email;

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  it("should return 400 if no password is not provided", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();
    delete httpRequest.body.password;

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  it("should return 400 if e-mail is not valid", async () => {
    // given
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeHttpRequest();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  it("should call EmailValidator with correct e-mail", async () => {
    // given
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeHttpRequest();
    const isValidSpy = jest
      .spyOn(emailValidatorStub, "isValid")
      .mockReturnValueOnce(false);

    // when
    await sut.handle(httpRequest);

    // then
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
});
