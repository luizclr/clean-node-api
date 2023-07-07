import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { AccountWithPass } from "~/domain/entities/account";

export const makeGetAccountByEmailRepositoryStub = (
  id: string,
  name: string,
  password: string
): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async get(email: string): Promise<AccountWithPass> {
      return {
        id,
        name,
        email,
        password,
      };
    }
  }

  return new GetAccountByEmailRepositoryStub();
};
