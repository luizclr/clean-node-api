import { StatusCodes } from "http-status-codes";
import { faker } from "@faker-js/faker";

import {
  AccountAlreadyExistError,
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "~/presentation/errors";
import { HttpRequest } from "~/presentation/protocols/http";
import SignupController from "~/presentation/controllers/auth/signup/signup-controller";
import {
  badRequest,
  conflict,
  ok,
  serverError,
} from "~/presentation/helpers/http-helper";

import makeEmailValidator from "#/utils/factories/make-email-validator";
import { makeAddAccount } from "#/utils/factories/make-add-account";
import { sutTypes } from "#/presentation/controllers/auth/signup/types";
import { makeAuthentication } from "#/utils/factories/make-authentication";

const id = faker.string.uuid();
const validToken = faker.string.alphanumeric(20);

const makeHttpRequest = (hasSamePasswords = true): HttpRequest => {
  const password = faker.internet.password();
  return {
    body: {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: hasSamePasswords ? password : faker.internet.password(),
      passwordConfirmation: password,
    },
  };
};

const makeSut = (): sutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount(id);
  const authenticationStub = makeAuthentication(validToken);

  return {
    sut: new SignupController(
      emailValidatorStub,
      addAccountStub,
      authenticationStub
    ),
    emailValidatorStub,
    addAccountStub,
    authenticationStub,
  };
};

// eslint-disable-next-line max-lines-per-function
describe("Signup Controller", () => {
  it("should return 400 if no name is not provided", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();
    delete httpRequest.body.name;

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("name")));
  });

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

  it("should return 400 if password is not provided", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();
    delete httpRequest.body.password;

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  it("should return 400 if password confirmation is not provided", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();
    delete httpRequest.body.passwordConfirmation;

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("passwordConfirmation"))
    );
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

  it("should return 400 if passwords are different", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest(false);

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError("passwordConfirmation"))
    );
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

  it("should call addAccount with correct values", async () => {
    // given
    const { sut, addAccountStub } = makeSut();
    const httpRequest = makeHttpRequest();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const {
      body: { name, email, password },
    } = httpRequest;

    // when
    await sut.handle(httpRequest);

    // then
    expect(addSpy).toHaveBeenLastCalledWith({ name, email, password });
  });

  it("should return 500 if AddAccount throws an error", async () => {
    // given
    const { sut, addAccountStub } = makeSut();
    const stack = "fake_stack";
    const error = new ServerError(stack);
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return Promise.reject(error);
    });
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(serverError(error));
  });

  it("should return 200 if accounts data are correct", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(ok({ accessToken: validToken }));
  });

  it("should call Authentication with correct values", async () => {
    // given
    const { sut, authenticationStub } = makeSut();
    const httpRequest = makeHttpRequest();
    const addSpy = jest.spyOn(authenticationStub, "auth");
    const {
      body: { email, password },
    } = httpRequest;

    // when
    await sut.handle(httpRequest);

    // then
    expect(addSpy).toHaveBeenLastCalledWith(email, password);
  });

  it("should return 500 if Authentication throws an error", async () => {
    // given
    const { sut, authenticationStub } = makeSut();
    const stack = "fake_stack";
    const error = new ServerError(stack);
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(() => {
      throw error;
    });
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(serverError(error));
  });

  it("should return 403 if e-mail is already added when add in AddAccount", async () => {
    // given
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, "add")
      .mockReturnValueOnce(Promise.resolve(null));
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(conflict(new AccountAlreadyExistError()));
  });
});
