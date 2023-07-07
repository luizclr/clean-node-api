import { Account, AddAccountModel } from "~/domain/entities/account";
import { AddAccount } from "~/domain/use-cases/add-account/add-account";

export const makeAddAccount = (id: string): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add({ name, email }: AddAccountModel): Promise<Account> {
      return {
        id,
        name,
        email,
      };
    }
  }

  return new AddAccountStub();
};
