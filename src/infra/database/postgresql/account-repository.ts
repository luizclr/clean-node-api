import { AddAccountRepository } from "~/data/protocols/add-account-repository";
import { Account, AddAccountModel } from "~/domain/entities/account";

import { knexMem } from "#/infra/db/postgresql/helpers/postgresql-helper";
export class AccountPgRepository implements AddAccountRepository {
  public async add(account: AddAccountModel): Promise<Account> {
    const [result] = await knexMem<Account>("accounts")
      .insert(account)
      .returning(["id", "name", "email"]);

    return new Promise((resolve) => resolve(result));
  }
}
