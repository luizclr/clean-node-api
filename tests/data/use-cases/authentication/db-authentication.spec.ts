import { faker } from "@faker-js/faker";

import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { DbAuthentication } from "~/data/use-cases/authentication/db-authentication";
import { AccountWithPass } from "~/domain/entities/account";
import { HashComparer } from "~/data/protocols/cryptography/hash-comparer";

import { makeSutTypes } from "#/data/use-cases/authentication/types";

const email = faker.internet.email();
const password = faker.string.alphanumeric(20);
const hashedPassword = faker.string.alphanumeric(20);

const makeGetAccountByEmailRepositoryStub = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async get(email: string): Promise<AccountWithPass> {
      return {
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        email,
        password: hashedPassword,
      };
    }
  }

  return new GetAccountByEmailRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(_value: string, _hash: string): Promise<boolean> {
      return true;
    }
  }

  return new HashComparerStub();
};

const makeSut = (): makeSutTypes => {
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepositoryStub();
  const hashComparerStub = makeHashComparer();
  const sut = new DbAuthentication(
    getAccountByEmailRepositoryStub,
    hashComparerStub
  );

  return { sut, getAccountByEmailRepositoryStub, hashComparerStub };
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

  it("should call HashCompare with correct values", async () => {
    // given
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");

    // when
    await sut.auth(email, password);

    // then
    expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
  });
});
