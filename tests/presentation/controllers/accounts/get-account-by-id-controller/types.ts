import { Account } from "~/domain/entities/account";
import { GetAccountById } from "~/domain/use-cases/get-account-by-id/get-accounts-by-id";
import { GetAccountByIdController } from "~/presentation/controllers/accounts/get-account-by-id-controller/get-account-by-id-controller";

export type MakeSutType = {
  sut: GetAccountByIdController;
  getAccountByIdStub: GetAccountById;
  mockAccount: Account;
};
