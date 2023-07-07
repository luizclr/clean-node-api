import { GetAccountByEmailRepository } from "~/data/protocols/get-account-by-email-repository";
import { DbAuthentication } from "~/data/usecases/authentication/db-authentication";

export type makeSutTypes = {
  sut: DbAuthentication;
  getAccountByEmailRepositoryStub: GetAccountByEmailRepository;
};
