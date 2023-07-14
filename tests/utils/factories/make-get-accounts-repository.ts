import { GetAccountsRepository } from "~/data/protocols/db/get-accounts-repository";
import { Account } from "~/domain/entities/account";

import { makeAccount } from "#/utils/factories/make-account";

const initialAccounts = [makeAccount()];

export const makeGetAccountsRepositoryStub = (
  accounts: Account[] = initialAccounts
): GetAccountsRepository => {
  class GetAccountsRepositoryStub implements GetAccountsRepository {
    async get(): Promise<Account[]> {
      return Promise.resolve(accounts);
    }
  }

  return new GetAccountsRepositoryStub();
};
