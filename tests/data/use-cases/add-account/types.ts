import { Hasher } from "~/data/protocols/cryptography/hasher";
import { AddAccountRepository } from "~/data/protocols/db/add-account-repository";
import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { DbAddAccount } from "~/data/use-cases/add-account/db-add-account";

export type SutTypes = {
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  sut: DbAddAccount;
  getAccountByEmailRepositoryStub: GetAccountByEmailRepository;
};
