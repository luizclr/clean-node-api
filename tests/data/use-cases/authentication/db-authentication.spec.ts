import { faker } from "@faker-js/faker";

import { DbAuthentication } from "~/data/use-cases/authentication/db-authentication";

import { makeSutTypes } from "#/data/use-cases/authentication/types";
import { makeHashComparer } from "#/test-utils/factories/make-hash-comparer";
import { makeTokenGenerator } from "#/test-utils/factories/make-token-generator";
import { makeUpdateAccessTokenRepositoryStub } from "#/test-utils/factories/make-update-access-token-repository";
import { makeGetAccountByEmailRepositoryStub } from "#/test-utils/factories/make-get-account-by-email-repository";

const id = faker.string.uuid();
const name = faker.person.firstName();
const email = faker.internet.email();
const password = faker.string.alphanumeric(20);
const hashedPassword = faker.string.alphanumeric(20);
const token = faker.string.alphanumeric(20);

const makeSut = (): makeSutTypes => {
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepositoryStub(
    id,
    name,
    hashedPassword
  );
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator(token);
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
  describe("GetAccountByEmailRepository", () => {
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

    it("should throw if GetAccountByEmailRepository throws", async () => {
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

    it("should return null if GetAccountByEmailRepository returns null", async () => {
      // given
      const { sut, getAccountByEmailRepositoryStub } = makeSut();
      jest
        .spyOn(getAccountByEmailRepositoryStub, "get")
        .mockReturnValueOnce(Promise.resolve(null));

      // when
      const accessToken = await sut.auth(email, password);

      // then
      await expect(accessToken).toBeNull();
    });
  });

  describe("HashComparer", () => {
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
  });

  describe("TokenGenerator", () => {
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
  });

  describe("updateAccessTokenRepository", () => {
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
});
