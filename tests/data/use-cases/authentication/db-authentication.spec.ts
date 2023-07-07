import { faker } from "@faker-js/faker";

import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { DbAuthentication } from "~/data/use-cases/authentication/db-authentication";
import { AccountWithPass } from "~/domain/entities/account";

import { makeSutTypes } from "#/data/use-cases/authentication/types";

const email = faker.internet.email();
const password = faker.string.alphanumeric(20);

const makeGetAccountByEmailRepositoryStub = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async get(email: string): Promise<AccountWithPass> {
      return {
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        email,
        password,
      };
    }
  }

  return new GetAccountByEmailRepositoryStub();
};

const makeSut = (): makeSutTypes => {
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepositoryStub();
  const sut = new DbAuthentication(getAccountByEmailRepositoryStub);

  return { sut, getAccountByEmailRepositoryStub };
};

describe("DbAuthentication use case", () => {
  it("should call GetAccountByEmailRepository with correct e-mail", async () => {
    // given
    const { sut, getAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getAccountByEmailRepositoryStub, "get")
      .mockReturnValueOnce(Promise.reject(new Error()));

    // when
    const promise = sut.auth(email, password);

    // then
    await expect(promise).rejects.toThrow();
  });
});
