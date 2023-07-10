import { faker } from "@faker-js/faker";

import { DbAuthentication } from "~/data/use-cases/authentication/db-authentication";

import { makeSutTypes } from "#/data/use-cases/authentication/types";
import { makeHashComparer } from "#/utils/factories/make-hash-comparer";
import { makeEncrypter } from "#/utils/factories/make-encrypter";
import { makeUpdateAccessTokenRepositoryStub } from "#/utils/factories/make-update-access-token-repository";
import { makeGetAccountByEmailRepositoryStub } from "#/utils/factories/make-get-account-by-email-repository";

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
  const encrypterStub = makeEncrypter(token);
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub();
  const sut = new DbAuthentication(
    getAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    getAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
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
        .spyOn(getAccountByEmailRepositoryStub, "getByEmail")
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
        .spyOn(getAccountByEmailRepositoryStub, "getByEmail")
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
        .spyOn(getAccountByEmailRepositoryStub, "getByEmail")
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

  describe("Encrypter", () => {
    it("should call Encrypter with correct id", async () => {
      // given
      const { sut, encrypterStub } = makeSut();
      const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

      // when
      await sut.auth(email, password);

      // then
      expect(encryptSpy).toHaveBeenCalledWith({ id });
    });

    it("should throw if Encrypter throws", async () => {
      // given
      const { sut, encrypterStub } = makeSut();
      jest
        .spyOn(encrypterStub, "encrypt")
        .mockReturnValueOnce(Promise.reject(new Error()));

      // when
      const promise = sut.auth(email, password);

      // then
      await expect(promise).rejects.toThrow();
    });

    it("should return null if Encrypter returns false", async () => {
      // given
      const { sut, encrypterStub } = makeSut();
      jest
        .spyOn(encrypterStub, "encrypt")
        .mockReturnValueOnce(Promise.resolve(null));

      // when
      const accessToken = await sut.auth(email, password);

      // then
      await expect(accessToken).toBeNull();
    });

    it("should encrypt correct accessToken", async () => {
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
      const updateSpy = jest.spyOn(
        updateAccessTokenRepositoryStub,
        "updateToken"
      );

      // when
      await sut.auth(email, password);

      // then
      await expect(updateSpy).toHaveBeenCalledWith(id, token);
    });

    it("should throw if updateAccessTokenRepository throws", async () => {
      // given
      const { sut, updateAccessTokenRepositoryStub } = makeSut();
      jest
        .spyOn(updateAccessTokenRepositoryStub, "updateToken")
        .mockReturnValueOnce(Promise.reject(new Error()));

      // when
      const promise = sut.auth(email, password);

      // then
      await expect(promise).rejects.toThrow();
    });
  });
});
