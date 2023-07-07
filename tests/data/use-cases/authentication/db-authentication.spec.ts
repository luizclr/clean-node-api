import { faker } from "@faker-js/faker";

import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { DbAuthentication } from "~/data/use-cases/authentication/db-authentication";
import { AccountWithPass } from "~/domain/entities/account";
import { HashComparer } from "~/data/protocols/cryptography/hash-comparer";
import { TokenGenerator } from "~/data/protocols/cryptography/token-generator";
import { UpdateAccessTokenRepository } from "~/data/protocols/db/update-access-token-repository";

import { makeSutTypes } from "#/data/use-cases/authentication/types";

const id = faker.string.uuid();
const email = faker.internet.email();
const password = faker.string.alphanumeric(20);
const hashedPassword = faker.string.alphanumeric(20);
const token = faker.string.alphanumeric(20);

const makeGetAccountByEmailRepositoryStub = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async get(email: string): Promise<AccountWithPass> {
      return {
        id,
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

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(_id: string): Promise<string> {
      return token;
    }
  }

  return new TokenGeneratorStub();
};

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(_id: string, _token: string): Promise<void> {
      return;
    }
  }

  return new UpdateAccessTokenRepositoryStub();
};

const makeSut = (): makeSutTypes => {
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepositoryStub();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub();
  const sut = new DbAuthentication(
    getAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    getAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  };
};

// eslint-disable-next-line max-lines-per-function
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

  it("should call HashComparer with correct values", async () => {
    // given
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");

    // when
    await sut.auth(email, password);

    // then
    expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
  });

  it("should throw if HashComparer throws", async () => {
    // given
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(Promise.reject(new Error()));

    // when
    const promise = sut.auth(email, password);

    // then
    await expect(promise).rejects.toThrow();
  });

  it("should return null if HashComparer returns false", async () => {
    // given
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(Promise.resolve(false));

    // when
    const accessToken = await sut.auth(email, password);

    // then
    await expect(accessToken).toBeNull();
  });

  it("should call TokenGenerator with correct id", async () => {
    // given
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, "generate");

    // when
    await sut.auth(email, password);

    // then
    expect(generateSpy).toHaveBeenCalledWith(id);
  });

  it("should throw if TokenGenerator throws", async () => {
    // given
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, "generate")
      .mockReturnValueOnce(Promise.reject(new Error()));

    // when
    const promise = sut.auth(email, password);

    // then
    await expect(promise).rejects.toThrow();
  });

  it("should return null if TokenGenerator returns false", async () => {
    // given
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, "generate")
      .mockReturnValueOnce(Promise.resolve(null));

    // when
    const accessToken = await sut.auth(email, password);

    // then
    await expect(accessToken).toBeNull();
  });

  it("should generate correct accessToken", async () => {
    // given
    const { sut } = makeSut();

    // when
    const accessToken = await sut.auth(email, password);

    // then
    await expect(accessToken).toBe(token);
  });

  it("should call updateAccessTokenRepository with correct values", async () => {
    // given
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "update");

    // when
    await sut.auth(email, password);

    // then
    await expect(updateSpy).toHaveBeenCalledWith(id, token);
  });

  it("should throw if updateAccessTokenRepository throws", async () => {
    // given
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "update")
      .mockReturnValueOnce(Promise.reject(new Error()));

    // when
    const promise = sut.auth(email, password);

    // then
    await expect(promise).rejects.toThrow();
  });
});
