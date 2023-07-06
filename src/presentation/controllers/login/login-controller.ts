import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "~/presentation/errors";
import { badRequest, serverError } from "~/presentation/helpers/http-helper";
import { Controller } from "~/presentation/protocols/controller";
import { EmailValidator } from "~/presentation/protocols/email-validator";
import { HttpRequest, HttpResponse } from "~/presentation/protocols/http";

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field));
      }

      const { email } = httpRequest.body;
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      const newServerError = new ServerError(error.stack);
      return serverError(newServerError);
    }
  }
}
