import { HashComparer } from "~/data/protocols/cryptography/hash-comparer";
import { TokenGenerator } from "~/data/protocols/cryptography/token-generator";
import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { UpdateAccessTokenRepository } from "~/data/protocols/db/update-access-token-repository";
import { DbAuthentication } from "~/data/use-cases/authentication/db-authentication";

export type makeSutTypes = {
  sut: DbAuthentication;
  getAccountByEmailRepositoryStub: GetAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};
