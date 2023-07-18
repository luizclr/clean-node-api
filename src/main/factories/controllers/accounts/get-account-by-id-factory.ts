import { UUIDValidatorAdapter } from "~/infra/validators/uuid-validator-adapter";
import { LogControllerDecorator } from "~/main/decorators/log-decorator/log-controller";
import { makeDbLogErrorRepository } from "~/main/factories/protocols/log-error-repository/db-log-error-repository-factory";
import { makeDbGetAccountById } from "~/main/factories/use-cases/get-account-by-id/db-get-accounts-factory";
import { GetAccountByIdController } from "~/presentation/controllers/accounts/get-account-by-id-controller/get-account-by-id-controller";
import { Controller } from "~/presentation/protocols/controller";

export const makeGetAccountByIdController = (): Controller => {
  const uuidValidator = new UUIDValidatorAdapter();
  const dbGetAccountById = makeDbGetAccountById();
  const getAccountByIdController = new GetAccountByIdController(
    dbGetAccountById,
    uuidValidator
  );
  const logPgRepository = makeDbLogErrorRepository();

  return new LogControllerDecorator(getAccountByIdController, logPgRepository);
};
