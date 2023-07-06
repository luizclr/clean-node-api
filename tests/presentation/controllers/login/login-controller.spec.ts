import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";

import { LoginController } from "~/presentation/controllers/login/login-controller";
import { MissingParamError } from "~/presentation/errors";
import { badRequest } from "~/presentation/helpers/http-helper";
import { EmailValidator } from "~/presentation/protocols/email-validator";
import { HttpRequest } from "~/presentation/protocols/http";

type MakeSutType = {
  sut: LoginController;
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): MakeSutType => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);

  return { sut };
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
});
