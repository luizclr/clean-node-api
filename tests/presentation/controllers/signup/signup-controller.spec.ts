import { StatusCodes } from "http-status-codes";
import { faker } from "@faker-js/faker";

import { Account, AddAccountModel } from "~/domain/entities/account";
import { AddAccount } from "~/domain/use-cases/add-account";
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "~/presentation/errors";
import { EmailValidator } from "~/presentation/protocols/email-validator";
import { HttpRequest } from "~/presentation/protocols/http";
import SignupController from "~/presentation/controllers/signup/signup-controller";
import {
  badRequest,
  ok,
  serverError,
} from "~/presentation/helpers/http-helper";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  const id = faker.string.uuid();
  class AddAccountStub implements AddAccount {
    async add({ name, email }: AddAccountModel): Promise<Account> {
      return {
        id,
        name,
        email,
      };
    }
  }

  return new AddAccountStub();
};

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

type sutTypes = {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
};

const makeSut = (): sutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();

  return {
    sut: new SignupController(emailValidatorStub, addAccountStub),
    emailValidatorStub,
    addAccountStub,
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
    expect(httpResponse).toEqual(ok(httpResponse.body));
  });
});
