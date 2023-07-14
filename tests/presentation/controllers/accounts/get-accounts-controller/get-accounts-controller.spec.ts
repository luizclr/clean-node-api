import { ServerError } from "~/presentation/errors";
import { ok, serverError } from "~/presentation/helpers/http-helper";
import { GetAccountsController } from "~/presentation/controllers/accounts/get-accounts-controller/get-accounts-controller";

import { MakeSutType } from "#/presentation/controllers/accounts/get-accounts-controller/types";
import { makeGetAccountsStub } from "#/utils/factories/make-get-accounts";
import { makeAccount } from "#/utils/factories/make-account";

const makeSut = (): MakeSutType => {
  const mockAccounts = [makeAccount()];
  const getAccountsRepositoryStub = makeGetAccountsStub(mockAccounts);
  const sut = new GetAccountsController(getAccountsRepositoryStub);

  return { sut, getAccountsRepositoryStub, mockAccounts };
};

describe("Login Controller", () => {
  it("should call GetAccounts", async () => {
    // given
    const { sut, getAccountsRepositoryStub } = makeSut();
    const isValidSpy = jest.spyOn(getAccountsRepositoryStub, "getAll");
    // when
    await sut.handle();

    // then
    expect(isValidSpy).toHaveBeenCalled();
  });

  it("should return 500 if GetAccounts throws an error", async () => {
    // given
    const { sut, getAccountsRepositoryStub } = makeSut();
    const stack = "fake_stack";
    const error = new ServerError(stack);
    jest
      .spyOn(getAccountsRepositoryStub, "getAll")
      .mockImplementationOnce(() => {
        throw error;
      });

    // when
    const httpResponse = await sut.handle();

    // then
    expect(httpResponse).toEqual(serverError(error));
  });

  it("should return 200 if success", async () => {
    // given
    const { sut, mockAccounts } = makeSut();

    // when
    const httpResponse = await sut.handle();

    // then
    expect(httpResponse).toEqual(ok(mockAccounts));
  });
});
