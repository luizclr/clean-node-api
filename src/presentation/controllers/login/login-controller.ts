import { Authentication } from "~/domain/use-cases/authentication/authentication";
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
import { Controller } from "~/presentation/protocols/controller";
import { EmailValidator } from "~/presentation/protocols/email-validator";
import { HttpRequest, HttpResponse } from "~/presentation/protocols/http";

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field));
      }

      const { email, password } = httpRequest.body;
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) return unauthorized("Invalid credentials");

      return ok({ accessToken });
    } catch (error) {
      const newServerError = new ServerError(error.stack);
      return serverError(newServerError);
    }
  }
}
