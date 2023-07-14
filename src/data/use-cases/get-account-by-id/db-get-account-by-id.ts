import { GetAccountByIdRepository } from "~/data/protocols/db/get-account-by-id-repository";
import { Account } from "~/domain/entities/account";
import { GetAccountById } from "~/domain/use-cases/get-account-by-id/get-accounts-by-id";

export class DbGetAccountById implements GetAccountById {
  constructor(
    private readonly getAccountByIdRepository: GetAccountByIdRepository
  ) {}

  async getById(id: string): Promise<Account> {
    const account = await this.getAccountByIdRepository.getById(id);

    return account;
  }
}
