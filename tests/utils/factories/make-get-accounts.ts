import { GetAccountsRepository } from "~/data/protocols/db/get-accounts-repository";
import { Account } from "~/domain/entities/account";
import { GetAccounts } from "~/domain/use-cases/get-accounts/get-accounts";

import { makeAccount } from "#/utils/factories/make-account";

const initialAccounts = [makeAccount()];

export const makeGetAccountsStub = (
  accounts: Account[] = initialAccounts
): GetAccountsRepository => {
  class GetAccountsStub implements GetAccounts {
    async getAll(): Promise<Account[]> {
      return Promise.resolve(accounts);
    }
  }

  return new GetAccountsStub();
};
