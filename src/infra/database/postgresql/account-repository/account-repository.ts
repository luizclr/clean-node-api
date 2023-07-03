import { Knex } from "knex";
import { AddAccountRepository } from "~/data/protocols/add-account-repository";
import { Account, AddAccountModel } from "~/domain/entities/account";
import { UserAlreadyExistError } from "~/presentation/errors/server-error copy";

export class AccountPgRepository implements AddAccountRepository {
  private knexInstance: Knex;

  constructor(knexInstance: Knex) {
    this.knexInstance = knexInstance;
  }

  public async add(account: AddAccountModel): Promise<Account> {
    if (await this.userAlreadyExists(account.email))
      return Promise.reject(new UserAlreadyExistError());

    const [result] = await this.knexInstance<Account>("accounts")
      .insert(account)
      .returning(["id", "name", "email"]);

    return new Promise((resolve) => resolve(result));
  }

  private async userAlreadyExists(email: string): Promise<boolean> {
    const [userAlreadyExists] = await this.knexInstance<Account>(
      "accounts"
    ).where("email", email);

    return !!userAlreadyExists;
  }
}
