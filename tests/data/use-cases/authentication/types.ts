import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { DbAuthentication } from "~/data/use-cases/authentication/db-authentication";

export type makeSutTypes = {
  sut: DbAuthentication;
  getAccountByEmailRepositoryStub: GetAccountByEmailRepository;
};
