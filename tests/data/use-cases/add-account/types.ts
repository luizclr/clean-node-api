import { Hasher } from "~/data/protocols/cryptography/hasher";
import { AddAccountRepository } from "~/data/protocols/db/add-account-repository";
import { DbAddAccount } from "~/data/use-cases/add-account/db-add-account";

export type SutTypes = {
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  sut: DbAddAccount;
};
