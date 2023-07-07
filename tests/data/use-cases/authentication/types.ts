import { HashComparer } from "~/data/protocols/cryptography/hash-comparer";
import { Encrypter } from "~/data/protocols/cryptography/encrypter";
import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { UpdateAccessTokenRepository } from "~/data/protocols/db/update-access-token-repository";
import { DbAuthentication } from "~/data/use-cases/authentication/db-authentication";

export type makeSutTypes = {
  sut: DbAuthentication;
  getAccountByEmailRepositoryStub: GetAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};
