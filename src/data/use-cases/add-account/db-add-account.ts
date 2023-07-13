import { Account, AddAccountModel } from "~/domain/entities/account";
import { AddAccount } from "~/domain/use-cases/add-account/add-account";
import { AddAccountRepository } from "~/data/protocols/db/add-account-repository";
import { Hasher } from "~/data/protocols/cryptography/hasher";
import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository
  ) {}

  async add({ name, email, password }: AddAccountModel): Promise<Account> {
    const account = await this.getAccountByEmailRepository.getByEmail(email);

    if (account) return null;

    const hashedPassword = await this.hasher.hash(password);
    const NewAccount = await this.addAccountRepository.add({
      name,
      email,
      password: hashedPassword,
    });

    return Promise.resolve(NewAccount);
  }
}
