import { GetAccountsRepository } from "~/data/protocols/db/get-accounts-repository";
import { Account } from "~/domain/entities/account";
import { GetAccounts } from "~/domain/use-cases/get-accounts/get-accounts";

export class DbGetAccounts implements GetAccounts {
  constructor(private readonly getAccountsRepository: GetAccountsRepository) {}

  async get(): Promise<Account[]> {
    const accounts = await this.getAccountsRepository.get();

    return accounts;
  }
}
