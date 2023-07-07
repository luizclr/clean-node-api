import { HashComparer } from "~/data/protocols/cryptography/hash-comparer";
import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { DbAuthentication } from "~/data/use-cases/authentication/db-authentication";

export type makeSutTypes = {
  sut: DbAuthentication;
  getAccountByEmailRepositoryStub: GetAccountByEmailRepository;
  hashComparerStub: HashComparer;
};
