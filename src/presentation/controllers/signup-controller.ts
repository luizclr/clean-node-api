import { AddAccount } from "~/domain/use-cases/add-account";
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "~/presentation/errors";
import { AccountAlreadyExistError } from "~/presentation/errors/account-already-exist-error";
import {
  badRequest,
  serverError,
  ok,
  accountAlreadyExist,
} from "~/presentation/helpers/http-helper";
import { Controller } from "~/presentation/protocols/controller";
import { EmailValidator } from "~/presentation/protocols/email-validator";
import { HttpRequest, HttpResponse } from "~/presentation/protocols/http";

export default class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }
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

      return ok(newAccount);
    } catch (error) {
      if (error instanceof AccountAlreadyExistError)
        return accountAlreadyExist();

      const newServerError = new ServerError(error.stack);

      return serverError(newServerError);
    }
  }
}
