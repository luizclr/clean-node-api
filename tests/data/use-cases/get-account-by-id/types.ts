import { GetAccountByIdRepository } from "~/data/protocols/db/get-account-by-id-repository";
import { DbGetAccountById } from "~/data/use-cases/get-account-by-id/db-get-account-by-id";

export type SutTypes = {
  sut: DbGetAccountById;
  getAccountByIdRepositoryStub: GetAccountByIdRepository;
};
