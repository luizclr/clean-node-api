import { Account, AddAccountModel } from "~/domain/entities/account";
import { AddAccount } from "~/domain/use-cases/add-account/add-account";
import { AddAccountRepository } from "~/data/protocols/db/add-account-repository";
import { Hasher } from "~/data/protocols/cryptography/hasher";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {
    this.hasher = hasher;
    this.addAccountRepository = addAccountRepository;
  }

  async add({ name, email, password }: AddAccountModel): Promise<Account> {
    const hashedPassword = await this.hasher.hash(password);
    const account = await this.addAccountRepository.add({
      name,
      email,
      password: hashedPassword,
    });

    return Promise.resolve(account);
  }
}
