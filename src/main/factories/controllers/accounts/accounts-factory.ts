import { LogControllerDecorator } from "~/main/decorators/log-decorator/log-controller";
import { makeDbLogErrorRepository } from "~/main/factories/protocols/log-error-repository/db-log-error-repository-factory";
import { makeDbGetAccounts } from "~/main/factories/use-cases/get-accounts/db-get-accounts-factory";
import { GetAccountsController } from "~/presentation/controllers/accounts/get-accounts-controller/get-accounts-controller";
import { Controller } from "~/presentation/protocols/controller";

export const makeGetAccountsController = (): Controller => {
  const dbGetAccounts = makeDbGetAccounts();
  const getAccountsController = new GetAccountsController(dbGetAccounts);
  const logPgRepository = makeDbLogErrorRepository();

  return new LogControllerDecorator(getAccountsController, logPgRepository);
};
