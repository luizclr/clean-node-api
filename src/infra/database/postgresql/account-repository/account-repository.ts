import { Knex } from "knex";

import { AddAccountRepository } from "~/data/protocols/db/add-account-repository";
import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { UpdateAccessTokenRepository } from "~/data/protocols/db/update-access-token-repository";
import {
  Account,
  AccountWithPass,
  AddAccountModel,
} from "~/domain/entities/account";
import { AccountAlreadyExistError } from "~/presentation/errors";

export class AccountPgRepository
  implements
    AddAccountRepository,
    GetAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  constructor(private readonly knexInstance: Knex) {}

  public async add(account: AddAccountModel): Promise<Account> {
    if (await this.getByEmail(account.email))
      return Promise.reject(new AccountAlreadyExistError());

    const [result] = await this.knexInstance<Account>("accounts")
      .insert(account)
      .returning(["id", "name", "email"]);

    return result;
  }

  async getByEmail(email: string): Promise<AccountWithPass> {
    const account = await this.knexInstance<AccountWithPass>("accounts")
      .select(["id", "name", "email", "password"])
      .where("email", email)
      .first();

    return account;
  }

  async updateToken(id: string, token: string): Promise<void> {
    await this.knexInstance("accounts")
      .update("accessToken", token)
      .where("id", id);
  }
}
