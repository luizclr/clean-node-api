import { Account } from "../entities/account";

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}

export interface AddAccount {
  add(account: AddAccountModel): Promise<Account>;
}
