import { Knex } from "knex";

import { AddAccountRepository } from "~/data/protocols/db/add-account-repository";
import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { GetAccountByIdRepository } from "~/data/protocols/db/get-account-by-id-repository";
import { GetAccountsRepository } from "~/data/protocols/db/get-accounts-repository";
import { UpdateAccessTokenRepository } from "~/data/protocols/db/update-access-token-repository";
import {
  Account,
  AccountWithPass,
  AddAccountModel,
} from "~/domain/entities/account";

export class AccountPgRepository
  implements
    AddAccountRepository,
    GetAccountByEmailRepository,
    UpdateAccessTokenRepository,
    GetAccountsRepository,
    GetAccountByIdRepository
{
  constructor(private readonly knexInstance: Knex) {}

  public async add(account: AddAccountModel): Promise<Account> {
    const [result] = await this.knexInstance<Account>("accounts")
      .insert(account)
      .returning(["id", "name", "email"]);

    return result;
  }

  async getAll(): Promise<Account[]> {
    const accounts = await this.knexInstance<Account>("accounts").select([
      "id",
      "name",
      "email",
    ]);

    return accounts;
  }

  async getByEmail(email: string): Promise<AccountWithPass> {
    const account = await this.knexInstance<AccountWithPass>("accounts")
      .select(["id", "name", "email", "password"])
      .where("email", email)
      .first();

    return account;
  }

  async getById(id: string): Promise<Account> {
    const account = await this.knexInstance<Account>("accounts")
      .select(["id", "name", "email"])
      .where("id", id)
      .first();

    return account;
  }

  async updateToken(id: string, token: string): Promise<void> {
    await this.knexInstance("accounts")
      .update("accessToken", token)
      .where("id", id);
  }
}
