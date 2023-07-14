import { ServerError } from "~/presentation/errors";
import { ok, serverError } from "~/presentation/helpers/http-helper";
import { Controller } from "~/presentation/protocols/controller";
import { HttpResponse } from "~/presentation/protocols/http";
import { GetAccounts } from "~/domain/use-cases/get-accounts/get-accounts";

export class GetAccountsController implements Controller {
  constructor(private readonly getAccounts: GetAccounts) {}

  async handle(): Promise<HttpResponse> {
    try {
      const accounts = await this.getAccounts.getAll();

      return ok(accounts);
    } catch (error) {
      const newServerError = new ServerError(error.stack);
      return serverError(newServerError);
    }
  }
}
