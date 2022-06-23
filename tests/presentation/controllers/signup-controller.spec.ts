import { StatusCodes } from "http-status-codes";
import { Account } from "../../../src/domain/entities/account";
import {
  AddAccount,
  AddAccountModel,
} from "../../../src/domain/use-cases/add-account";
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../../src/presentation/errors";
import { EmailValidator } from "../../../src/presentation/protocols/email-validator";
import { HttpRequest } from "../../../src/presentation/protocols/http";
import SignupController from "../../../src/presentation/controllers/signup-controller";

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
    async add({ name, email, password }: AddAccountModel): Promise<Account> {
      return new Account(faker.datatype.uuid(), name, email, password);
    }
  }

  return new AddAccountStub();
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
        name: faker.name.firstName(),
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
        name: faker.name.firstName(),
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
        name: faker.name.firstName(),
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
    const password = faker.internet.password();
    const httpRequest: HttpRequest = {
      body: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password,
      },
    };
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  it("should return 400 if passwords are diferent", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: faker.name.firstName(),
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
        name: faker.name.firstName(),
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
      throw new ServerError();
    });
    const password = faker.internet.password();
    const httpRequest: HttpRequest = {
      body: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password,
      },
    };

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it("should call addAccount with correct values", async () => {
    // given
    const { sut, addAccountStub } = makeSut();
    const password = faker.internet.password();
    const data = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
    };
    const httpRequest: HttpRequest = {
      body: { ...data, passwordConfirmation: password },
    };
    const addSpy = jest.spyOn(addAccountStub, "add");

    // when
    await sut.handle(httpRequest);

    // then
    expect(addSpy).toHaveBeenLastCalledWith(data);
  });

  it("should return 500 if AddAccount throws an error", async () => {
    // given
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return Promise.reject(new ServerError());
    });
    const password = faker.internet.password();
    const httpRequest: HttpRequest = {
      body: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password,
      },
    };

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it("should return 200 if accouns data are correct", async () => {
    // given
    const { sut } = makeSut();
    const password = faker.internet.password();
    const httpRequest: HttpRequest = {
      body: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password,
      },
    };

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.OK);
  });
});
