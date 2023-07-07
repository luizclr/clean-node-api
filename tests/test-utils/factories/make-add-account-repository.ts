import { AddAccountRepository } from "~/data/protocols/db/add-account-repository";
import { Account, AddAccountModel } from "~/domain/entities/account";

export const makeAddAccountRepositoryStub = (
  id: string
): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add({ name, email }: AddAccountModel): Promise<Account> {
      const account: Account = { id, name, email };

      return Promise.resolve(account);
    }
  }

  return new AddAccountRepositoryStub();
};
