import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";

import { LoginController } from "~/presentation/controllers/login/login-controller";
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "~/presentation/errors";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "~/presentation/helpers/http-helper";
import { HttpRequest } from "~/presentation/protocols/http";

import makeEmailValidator from "#/test-utils/factories/make-email-validator";
import { makeAuthentication } from "#/test-utils/factories/make-authentication";
import { MakeSutType } from "#/presentation/controllers/login/types";

const validToken = faker.string.alphanumeric(20);

const makeSut = (): MakeSutType => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication(validToken);
  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return { sut, emailValidatorStub, authenticationStub };
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

// eslint-disable-next-line max-lines-per-function
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

  it("should return 500 if EmailValidator throws an error", async () => {
    // given
    const { sut, emailValidatorStub } = makeSut();
    const stack = "fake_stack";
    const error = new ServerError(stack);
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw error;
    });
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(serverError(error));
  });

  it("should call Authentication with correct values", async () => {
    // given
    const { sut, authenticationStub } = makeSut();
    const httpRequest = makeHttpRequest();
    const authSpy = jest.spyOn(authenticationStub, "auth");

    // when
    sut.handle(httpRequest);

    // then
    const { email, password } = httpRequest.body;
    expect(authSpy).toHaveBeenCalledWith(email, password);
  });

  it("should return 401 if credentials are invalid", async () => {
    // given
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(Promise.resolve(null));
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(unauthorized("Invalid credentials"));
  });

  it("should return 500 if authentication throws", async () => {
    // given
    const { sut, authenticationStub } = makeSut();
    const stack = "fake_stack";
    const error = new ServerError(stack);
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(() => {
      return Promise.reject(error);
    });
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(serverError(error));
  });

  it("should return 200 if valid credentials were provided", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(ok({ accessToken: validToken }));
  });
});
