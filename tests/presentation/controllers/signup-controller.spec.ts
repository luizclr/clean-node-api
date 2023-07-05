import { StatusCodes } from "http-status-codes";
import { Account, AddAccountModel } from "~/domain/entities/account";
import { AddAccount } from "~/domain/use-cases/add-account";
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "~/presentation/errors";
import { EmailValidator } from "~/presentation/protocols/email-validator";
import { HttpRequest } from "~/presentation/protocols/http";
import SignupController from "~/presentation/controllers/signup-controller";

import { faker } from "@faker-js/faker";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add({ name, email }: AddAccountModel): Promise<Account> {
      return {
        id: faker.string.uuid(),
        name,
        email,
      };
    }
  }

  return new AddAccountStub();
};

const makeHttpRequest = (): HttpRequest => {
  const password = faker.internet.password();
  return {
    body: {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password,
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

describe("Signup Controller", () => {
  it("should return 400 if no name is not provided", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        passwordConfirmation: "password",
      },
    };

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  it("should return 400 if no e-mail is not provided", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: faker.person.firstName(),
        password: faker.internet.password(),
        passwordConfirmation: "password",
      },
    };

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  it("should return 400 if password is not provided", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        passwordConfirmation: "password",
      },
    };

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  it("should return 400 if password confirmation is not provided", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
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
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  it("should return 400 if passwords are different", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        passwordConfirmation: faker.internet.password(),
      },
    };

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });

  it("should call EmailValidator with correct e-mail", async () => {
    // given
    const { sut, emailValidatorStub } = makeSut();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const httpRequest: HttpRequest = {
      body: {
        name: faker.person.firstName(),
        email,
        password,
        passwordConfirmation: password,
      },
    };
    const isValidSpy = jest
      .spyOn(emailValidatorStub, "isValid")
      .mockReturnValueOnce(false);

    // when
    await sut.handle(httpRequest);

    // then
    expect(isValidSpy).toHaveBeenCalledWith(email);
  });

  it("should return 500 if EmailValidator throws an error", async () => {
    // given
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new ServerError(new Error().stack);
    });
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError(new Error().stack));
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
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return Promise.reject(new ServerError(new Error().stack));
    });
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError(new Error().stack));
  });

  it("should return 200 if accounts data are correct", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.OK);
  });
});
