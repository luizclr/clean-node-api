import { AddAccountRepository } from "~/data/protocols/add-account-repository";
import { Account, AddAccountModel } from "~/domain/entities/account";

export class AccountPgRepository implements AddAccountRepository {
  public add(_account: AddAccountModel): Promise<Account> {
    return null;
  }
}
