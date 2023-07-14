import { MissingParamError, ServerError } from "~/presentation/errors";
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "~/presentation/helpers/http-helper";
import { Controller } from "~/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "~/presentation/protocols/http";
import { GetAccountById } from "~/domain/use-cases/get-account-by-id/get-accounts-by-id";

export class GetAccountByIdController implements Controller {
  constructor(private readonly getAccountById: GetAccountById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.params.id)
        return badRequest(new MissingParamError("id"));

      const { id } = httpRequest.params;

      const account = await this.getAccountById.getById(id);

      if (!account) return notFound("Account not found");

      return ok(account);
    } catch (error) {
      const newServerError = new ServerError(error.stack);
      return serverError(newServerError);
    }
  }
}
