import { Knex } from "knex";

import { AddAccountRepository } from "~/data/protocols/add-account-repository";
import { Account, AddAccountModel } from "~/domain/entities/account";
import { AccountAlreadyExistError } from "~/presentation/errors/account-already-exist-error";

export class AccountPgRepository implements AddAccountRepository {
  private knexInstance: Knex;

  constructor(knexInstance: Knex) {
    this.knexInstance = knexInstance;
  }

  public async add(account: AddAccountModel): Promise<Account> {
    if (await this.accountAlreadyExist(account.email))
      return Promise.reject(new AccountAlreadyExistError());

    const [result] = await this.knexInstance<Account>("accounts")
      .insert(account)
      .returning(["id", "name", "email"]);

    return new Promise((resolve) => resolve(result));
  }

  private async accountAlreadyExist(email: string): Promise<boolean> {
    const [accountAlreadyExist] = await this.knexInstance<Account>(
      "accounts"
    ).where("email", email);

    return !!accountAlreadyExist;
  }
}
