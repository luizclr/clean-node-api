import { Encrypter } from "~/data/protocols/cryptography/encrypter";
import { AddAccountRepository } from "~/data/protocols/db/add-account-repository";
import { DbAddAccount } from "~/data/use-cases/add-account/db-add-account";

export type SutTypes = {
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
  sut: DbAddAccount;
};
