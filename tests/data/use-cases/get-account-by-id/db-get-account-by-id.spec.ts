import { faker } from "@faker-js/faker";

import { DbGetAccountById } from "~/data/use-cases/get-account-by-id/db-get-account-by-id";

import { SutTypes } from "#/data/use-cases/get-account-by-id/types";
import { makeAddAccountModel } from "#/utils/factories/make-add-account-model";
import { makeGetAccountByIdRepositoryStub } from "#/utils/factories/make-get-account-by-id-repository";

const id = faker.string.uuid();
const { name, email } = makeAddAccountModel();

const makeSut = (): SutTypes => {
  const getAccountByIdRepositoryStub = makeGetAccountByIdRepositoryStub({
    name,
    email,
  });

  return {
    getAccountByIdRepositoryStub,
    sut: new DbGetAccountById(getAccountByIdRepositoryStub),
  };
};

describe("DbGetAccountById use case", () => {
  describe("GetAccountByIdRepository", () => {
    it("should call GetAccountByIdRepository with correct values", async () => {
      // given
      const { getAccountByIdRepositoryStub, sut } = makeSut();
      const getSpy = jest.spyOn(getAccountByIdRepositoryStub, "getById");

      // when
      await sut.getById(id);

      // then
      expect(getSpy).toHaveBeenCalledWith(id);
    });

    it("should throw if GetAccountByIdRepository throws an error", () => {
      // given
      const { getAccountByIdRepositoryStub, sut } = makeSut();
      jest
        .spyOn(getAccountByIdRepositoryStub, "getById")
        .mockRejectedValueOnce(new Error());
      // const accountData = makeGetAccounts();

      // when
      const promise = sut.getById(id);

      // then
      expect(promise).rejects.toThrow();
    });

    it("should return null if getAccountByIdRepositoryStub returns null", async () => {
      // given
      const { sut, getAccountByIdRepositoryStub } = makeSut();
      jest
        .spyOn(getAccountByIdRepositoryStub, "getById")
        .mockReturnValueOnce(Promise.resolve(undefined));

      // when
      const account = await sut.getById(id);

      // then
      await expect(account).toBeUndefined();
    });

    it("should return an accounts on success", async () => {
      // given
      const { sut } = makeSut();

      // when
      const account = await sut.getById(id);

      // then
      expect(account).toBeTruthy();
      expect(account.id).toBe(id);
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
    });
  });
});
