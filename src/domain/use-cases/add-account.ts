import { Account, AddAccountModel } from "~/domain/entities/account";

export interface AddAccount {
  add(account: AddAccountModel): Promise<Account>;
}
