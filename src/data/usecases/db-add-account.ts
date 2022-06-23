import { Account, AddAccountModel } from "../../domain/entities/account";
import { AddAccount } from "../../domain/use-cases/add-account";
import { AddAccountRepository } from "../protocols/add-account-repository";
import { Encrypter } from "../protocols/encrypter";

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddAccountRepository;

  constructor(
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add({ name, email, password }: AddAccountModel): Promise<Account> {
    const hashedPasswotd = await this.encrypter.encrypt(password);
    const account = await this.addAccountRepository.add({
      name,
      email,
      password: hashedPasswotd,
    });

    return Promise.resolve(account);
  }
}
