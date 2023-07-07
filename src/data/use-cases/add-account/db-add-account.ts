import { Account, AddAccountModel } from "~/domain/entities/account";
import { AddAccount } from "~/domain/use-cases/add-account/add-account";
import { AddAccountRepository } from "~/data/protocols/db/add-account-repository";
import { Encrypter } from "~/data/protocols/cryptography/encrypter";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add({ name, email, password }: AddAccountModel): Promise<Account> {
    const hashedPassword = await this.encrypter.encrypt(password);
    const account = await this.addAccountRepository.add({
      name,
      email,
      password: hashedPassword,
    });

    return Promise.resolve(account);
  }
}
