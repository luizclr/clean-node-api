import { GetAccountsRepository } from "~/data/protocols/db/get-accounts-repository";
import { DbGetAccounts } from "~/data/use-cases/get-accounts/db-get-accounts";

export type SutTypes = {
  sut: DbGetAccounts;
  getAccountsRepositoryStub: GetAccountsRepository;
};
