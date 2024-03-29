import { StatusCodes } from "http-status-codes";

import { LogControllerDecorator } from "~/main/decorators/log-decorator/log-controller";
import { ServerError } from "~/presentation/errors";
import { ok, serverError } from "~/presentation/helpers/http-helper";
import { Controller } from "~/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "~/presentation/protocols/http";

import { makeSutTypes } from "#/main/decorators/log-controller/types";
import { makeLogErrorRepository } from "#/utils/factories/make-log-error-repository";

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: "name",
  },
});

class ControllerStub implements Controller {
  handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      statusCode: StatusCodes.OK,
      body: {
        name: "name",
      },
    };

    return Promise.resolve(httpResponse);
  }
}

const makeSut = (): makeSutTypes => {
  const controllerStub = new ControllerStub();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );

  return { sut, controllerStub, logErrorRepositoryStub };
};

describe("LogControllerDecorator", () => {
  it("should call controller handle", async () => {
    // given
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = makeHttpRequest();

    // when
    const httpResponse = await sut.handle(httpRequest);

    // then
    expect(handleSpy).toBeCalledWith(httpRequest);
    expect(httpResponse).toEqual(ok(httpRequest.body));
  });

  it("should call LogErrorRepository with correct error if controller returns a server error", async () => {
    // given
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new ServerError("fake_stack");
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(Promise.resolve(error));

    const httpRequest = makeHttpRequest();

    // when
    await sut.handle(httpRequest);

    // then
    expect(logSpy).toBeCalledWith("fake_stack");
  });
});
