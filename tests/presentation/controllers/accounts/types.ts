import { GetAccountsRepository } from "~/data/protocols/db/get-accounts-repository";
import { Account } from "~/domain/entities/account";
import { GetAccountsController } from "~/presentation/controllers/accounts/get-accounts-controller";

export type MakeSutType = {
  sut: GetAccountsController;
  getAccountsRepositoryStub: GetAccountsRepository;
  mockAccounts: Account[];
};
