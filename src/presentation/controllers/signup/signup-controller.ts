import { AddAccount } from "~/domain/use-cases/add-account/add-account";
import { Authentication } from "~/domain/use-cases/authentication/authentication";
import {
  AccountAlreadyExistError,
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "~/presentation/errors";
import {
  badRequest,
  serverError,
  ok,
  conflict,
} from "~/presentation/helpers/http-helper";
import { Controller } from "~/presentation/protocols/controller";
import { EmailValidator } from "~/presentation/protocols/email-validator";
import { HttpRequest, HttpResponse } from "~/presentation/protocols/http";

export default class SignupController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field));
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }

      const newAccount = await this.addAccount.add({ name, email, password });

      if (!newAccount) return conflict(new AccountAlreadyExistError());

      const accessToken = await this.authentication.auth(email, password);

      return ok({ accessToken });
    } catch (error) {
      const newServerError = new ServerError(error.stack);

      return serverError(newServerError);
    }
  }
}
