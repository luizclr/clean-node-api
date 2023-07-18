import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";

import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "~/presentation/errors";
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "~/presentation/helpers/http-helper";
import { GetAccountByIdController } from "~/presentation/controllers/accounts/get-account-by-id-controller/get-account-by-id-controller";
import { HttpRequest } from "~/presentation/protocols/http";

import { MakeSutType } from "#/presentation/controllers/accounts/get-account-by-id-controller/types";
import { makeAccount } from "#/utils/factories/make-account";
import { makeGetAccountByIdStub } from "#/utils/factories/make-get-account-by-id";
import makeUUIDValidator from "#/utils/factories/make-uuid-validator";

const makeSut = (): MakeSutType => {
  const mockAccount = makeAccount();
  const getAccountByIdStub = makeGetAccountByIdStub(mockAccount);
  const uuidValidatorStub = makeUUIDValidator();
  const sut = new GetAccountByIdController(
    getAccountByIdStub,
    uuidValidatorStub
  );

  return { sut, getAccountByIdStub, uuidValidatorStub, mockAccount };
};

const makeHttpRequest = (id = faker.string.uuid()): HttpRequest => {
  const httpRequest: HttpRequest = {
    params: { id },
  };

  return httpRequest;
};

describe("GetAccountById Controller", () => {
  it("should call GetAccountById", async () => {
    // given
    const { sut, getAccountByIdStub, mockAccount } = makeSut();
    const { id } = mockAccount;
    const httpRequest = makeHttpRequest(id);
    const isValidSpy = jest.spyOn(getAccountByIdStub, "getById");
    // when
    await sut.handle(httpRequest);

    // then
    expect(isValidSpy).toHaveBeenCalledWith(id);
  });

  it("should return 400 if no id is not provided", async () => {
    // given
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();
    delete httpRequest.params.id;

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("id")));
  });

  it("should return 400 if id is not valid", async () => {
    // given
    const { sut, uuidValidatorStub } = makeSut();
    const httpRequest = makeHttpRequest();
    jest.spyOn(uuidValidatorStub, "isValid").mockReturnValueOnce(false);

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError("id - invalid uuid format"))
    );
  });

  it("should return 404 if don't find account", async () => {
    // given
    const { sut, getAccountByIdStub } = makeSut();
    const httpRequest = makeHttpRequest();
    jest
      .spyOn(getAccountByIdStub, "getById")
      .mockReturnValueOnce(Promise.resolve(undefined));

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(httpResponse).toEqual(notFound("Account not found"));
  });

  it("should return 500 if GetAccountById throws an error", async () => {
    // given
    const { sut, getAccountByIdStub } = makeSut();
    const httpRequest = makeHttpRequest();
    const stack = "fake_stack";
    const error = new ServerError(stack);
    jest.spyOn(getAccountByIdStub, "getById").mockImplementationOnce(() => {
      throw error;
    });

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(serverError(error));
  });

  it("should return 200 if success", async () => {
    // given
    const { sut, mockAccount } = makeSut();
    const { id } = mockAccount;
    const httpRequest = makeHttpRequest(id);

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(httpResponse).toEqual(ok(mockAccount));
  });
});
