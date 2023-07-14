import { DbGetAccounts } from "~/data/use-cases/get-accounts/db-get-accounts";

import { makeGetAccountsRepositoryStub } from "#/utils/factories/make-get-accounts-repository";
import { SutTypes } from "#/data/use-cases/get-accounts/types";

const makeSut = (): SutTypes => {
  const getAccountsRepositoryStub = makeGetAccountsRepositoryStub();

  return {
    getAccountsRepositoryStub,
    sut: new DbGetAccounts(getAccountsRepositoryStub),
  };
};

describe("DbGetAccounts use case", () => {
  describe("GetAccountsRepository", () => {
    it("should throw if GetAccountsRepository throws an error", () => {
      // given
      const { getAccountsRepositoryStub, sut } = makeSut();
      jest
        .spyOn(getAccountsRepositoryStub, "getAll")
        .mockRejectedValueOnce(new Error());
      // const accountData = makeGetAccounts();

      // when
      const promise = sut.getAll();

      // then
      expect(promise).rejects.toThrow();
    });

    it("should return an empty array if GetAccountsRepository returns an empty array", async () => {
      // given
      const { getAccountsRepositoryStub, sut } = makeSut();
      jest
        .spyOn(getAccountsRepositoryStub, "getAll")
        .mockReturnValueOnce(Promise.resolve([]));

      // when
      const result = await sut.getAll();

      // then
      expect(result.length).toEqual(0);
    });

    it("should return a list of accounts if success", async () => {
      // given
      const { sut } = makeSut();

      // when
      const result = await sut.getAll();

      // then
      expect(result.length).toEqual(1);
    });
  });
});
