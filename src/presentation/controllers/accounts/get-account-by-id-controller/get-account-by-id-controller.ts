import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "~/presentation/errors";
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "~/presentation/helpers/http-helper";
import { Controller } from "~/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "~/presentation/protocols/http";
import { GetAccountById } from "~/domain/use-cases/get-account-by-id/get-accounts-by-id";
import { UUIDValidator } from "~/data/protocols/validators/uuid-validator";

export class GetAccountByIdController implements Controller {
  constructor(
    private readonly getAccountById: GetAccountById,
    private readonly uuidValidator: UUIDValidator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.params.id)
        return badRequest(new MissingParamError("id"));

      const { id } = httpRequest.params;

      if (!this.uuidValidator.isValid(id)) {
        return badRequest(new InvalidParamError("id - invalid uuid format"));
      }

      const account = await this.getAccountById.getById(id);

      if (!account) return notFound("Account not found");

      return ok(account);
    } catch (error) {
      const newServerError = new ServerError(error.stack);
      return serverError(newServerError);
    }
  }
}
