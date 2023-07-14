import { GetAccountByIdRepository } from "~/data/protocols/db/get-account-by-id-repository";
import { Account } from "~/domain/entities/account";

export const makeGetAccountByIdRepositoryStub = ({
  name,
  email,
}: {
  name: string;
  email: string;
}): GetAccountByIdRepository => {
  class GetAccountByIdRepositoryStub implements GetAccountByIdRepository {
    async getById(id: string): Promise<Account> {
      return {
        id,
        name,
        email,
      };
    }
  }

  return new GetAccountByIdRepositoryStub();
};
