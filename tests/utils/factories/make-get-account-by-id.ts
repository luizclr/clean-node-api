import { Account } from "~/domain/entities/account";
import { GetAccountById } from "~/domain/use-cases/get-account-by-id/get-accounts-by-id";

import { makeAccount } from "#/utils/factories/make-account";

const initialAccount = makeAccount();

export const makeGetAccountByIdStub = (
  account: Account = initialAccount
): GetAccountById => {
  class GetAccountByIdStub implements GetAccountById {
    async getById(id: string): Promise<Account> {
      account.id = id;
      return Promise.resolve(account);
    }
  }

  return new GetAccountByIdStub();
};
