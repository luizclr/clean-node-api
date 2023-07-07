import { faker } from "@faker-js/faker";

import { DbAddAccount } from "~/data/use-cases/add-account/db-add-account";

import { SutTypes } from "#/data/use-cases/add-account/types";
import { makeEncrypterStub } from "#/test-utils/factories/make-encrypter";
import { makeAddAccountRepositoryStub } from "#/test-utils/factories/make-add-account-repository";
import { makeAddAccountModel } from "#/test-utils/factories/make-add-account-model";

const id = faker.string.uuid();
const hashedPassword = faker.string.alphanumeric(20);

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub(hashedPassword);
  const addAccountRepositoryStub = makeAddAccountRepositoryStub(id);

  return {
    encrypterStub,
    addAccountRepositoryStub,
    sut: new DbAddAccount(encrypterStub, addAccountRepositoryStub),
  };
};

describe("DbAddAccount use case", () => {
  describe("Encrypter", () => {
    it("should call Encrypter with correct password", async () => {
      // given
      const { encrypterStub, sut } = makeSut();
      const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
      const accountData = makeAddAccountModel();

      // when
      await sut.add(accountData);

      // then
      expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
    });

    it("should throw if Encrypter throws an error", () => {
      // given
      const { encrypterStub, sut } = makeSut();
      jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
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
      const { addAccountRepositoryStub, sut } = makeSut();
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
      const { addAccountRepositoryStub, sut } = makeSut();
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
      const { sut } = makeSut();
      const { name, email, password } = makeAddAccountModel();

      // when
      const account = await sut.add({ name, email, password });

      // then
      expect(account).toEqual({ id, name, email });
    });
  });
});
