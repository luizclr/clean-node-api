import { Authentication } from "~/domain/use-cases/authentication";
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
  UnauthorizedError,
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

      const token = await this.authentication.auth(email, password);

      return ok({ token });
    } catch (error) {
      if (error instanceof UnauthorizedError)
        return unauthorized("Invalid credentials");

      const newServerError = new ServerError(error.stack);
      return serverError(newServerError);
    }
  }
}
