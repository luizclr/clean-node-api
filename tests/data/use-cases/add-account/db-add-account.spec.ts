import { faker } from "@faker-js/faker";

import { DbAddAccount } from "~/data/use-cases/add-account/db-add-account";
import { AccountWithPass } from "~/domain/entities/account";

import { SutTypes } from "#/data/use-cases/add-account/types";
import { makeHasherStub } from "#/utils/factories/make-hasher";
import { makeAddAccountRepositoryStub } from "#/utils/factories/make-add-account-repository";
import { makeAddAccountModel } from "#/utils/factories/make-add-account-model";
import { makeGetAccountByEmailRepositoryStub } from "#/utils/factories/make-get-account-by-email-repository";

const id = faker.string.uuid();
const name = faker.person.firstName();
const password = faker.internet.password();
const hashedPassword = faker.string.alphanumeric(20);

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub(hashedPassword);
  const addAccountRepositoryStub = makeAddAccountRepositoryStub(id);
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepositoryStub(
    id,
    name,
    password
  );

  return {
    hasherStub,
    addAccountRepositoryStub,
    getAccountByEmailRepositoryStub,
    sut: new DbAddAccount(
      hasherStub,
      addAccountRepositoryStub,
      getAccountByEmailRepositoryStub
    ),
  };
};

// eslint-disable-next-line max-lines-per-function
describe("DbAddAccount use case", () => {
  describe("GetAccountByEmailRepository", () => {
    it("should call GetAccountByEmailRepository with correct values", async () => {
      // given
      const { getAccountByEmailRepositoryStub, sut } = makeSut();
      const getSpy = jest.spyOn(getAccountByEmailRepositoryStub, "getByEmail");
      const { name, email, password } = makeAddAccountModel();

      // when
      await sut.add({ name, email, password });

      // then
      expect(getSpy).toHaveBeenCalledWith(email);
    });

    it("should throw if GetAccountByEmailRepository throws an error", () => {
      // given
      const { getAccountByEmailRepositoryStub, sut } = makeSut();
      jest
        .spyOn(getAccountByEmailRepositoryStub, "getByEmail")
        .mockRejectedValueOnce(new Error());
      const accountData = makeAddAccountModel();

      // when
      const promise = sut.add(accountData);

      // then
      expect(promise).rejects.toThrow();
    });

    it("should return null if GetAccountByEmailRepository not return null", async () => {
      // given
      const { getAccountByEmailRepositoryStub, sut } = makeSut();
      const { name, email, password } = makeAddAccountModel();
      const fakeAccount: AccountWithPass = {
        id,
        name,
        email,
        password,
      };
      jest
        .spyOn(getAccountByEmailRepositoryStub, "getByEmail")
        .mockReturnValueOnce(Promise.resolve(fakeAccount));

      // when
      const result = await sut.add({ name, email, password });

      // then
      expect(result).toBeNull();
    });
  });

  describe("Hasher", () => {
    it("should call Hasher with correct password", async () => {
      // given
      const { hasherStub, sut, getAccountByEmailRepositoryStub } = makeSut();
      jest
        .spyOn(getAccountByEmailRepositoryStub, "getByEmail")
        .mockReturnValueOnce(Promise.resolve(null));
      const hashSpy = jest.spyOn(hasherStub, "hash");
      const accountData = makeAddAccountModel();

      // when
      await sut.add(accountData);

      // then
      expect(hashSpy).toHaveBeenCalledWith(accountData.password);
    });

    it("should throw if Hasher throws an error", () => {
      // given
      const { hasherStub, sut, getAccountByEmailRepositoryStub } = makeSut();
      jest
        .spyOn(getAccountByEmailRepositoryStub, "getByEmail")
        .mockReturnValueOnce(Promise.resolve(null));
      jest.spyOn(hasherStub, "hash").mockRejectedValueOnce(new Error());
      const accountData = makeAddAccountModel();

      // when
      const promise = sut.add(accountData);

      // then
      expect(promise).rejects.toThrow();
    });
  });

  describe("AddAccountRepository", () => {
    it("should call AddAccountRepository with correct values", async () => {
      // given
      const { addAccountRepositoryStub, sut, getAccountByEmailRepositoryStub } =
        makeSut();
      jest
        .spyOn(getAccountByEmailRepositoryStub, "getByEmail")
        .mockReturnValueOnce(Promise.resolve(null));
      const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
      const { name, email, password } = makeAddAccountModel();

      // when
      await sut.add({ name, email, password });

      // then
      expect(addSpy).toHaveBeenCalledWith({
        name,
        email,
        password: hashedPassword,
      });
    });

    it("should throw if AddAccountRepository throws an error", () => {
      // given
      const { addAccountRepositoryStub, sut, getAccountByEmailRepositoryStub } =
        makeSut();
      jest
        .spyOn(getAccountByEmailRepositoryStub, "getByEmail")
        .mockReturnValueOnce(Promise.resolve(null));
      jest
        .spyOn(addAccountRepositoryStub, "add")
        .mockRejectedValueOnce(new Error());
      const accountData = makeAddAccountModel();

      // when
      const promise = sut.add(accountData);

      // then
      expect(promise).rejects.toThrow();
    });

    it("should return an Account if success", async () => {
      // given
      const { sut, getAccountByEmailRepositoryStub } = makeSut();
      const { name, email, password } = makeAddAccountModel();
      jest
        .spyOn(getAccountByEmailRepositoryStub, "getByEmail")
        .mockReturnValueOnce(Promise.resolve(null));

      // when
      const account = await sut.add({ name, email, password });

      // then
      expect(account).toEqual({ id, name, email });
    });
  });
});
