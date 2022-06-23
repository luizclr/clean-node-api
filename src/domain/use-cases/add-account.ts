import { Account, AddAccountModel } from "../entities/account";

export interface AddAccount {
  add(account: AddAccountModel): Promise<Account>;
}
