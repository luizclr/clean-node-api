import { Account, AddAccountModel } from "~/domain/entities/account";

export interface AddAccountRepository {
  add(account: AddAccountModel): Promise<Account>;
}
