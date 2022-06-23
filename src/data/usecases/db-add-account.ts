import { Account } from "../../domain/entities/account";
import {
  AddAccount,
  AddAccountModel,
} from "../../domain/use-cases/add-account";
import { Encrypter } from "../protocols/encrypter";

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add({ password }: AddAccountModel): Promise<Account> {
    await this.encrypter.encrypt(password);
    return Promise.resolve(null);
  }
}
