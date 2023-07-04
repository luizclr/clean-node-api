import { makeSutTypes } from "#/main/decorators/log-controller/types";
import { StatusCodes } from "http-status-codes";
import { LogControllerDecorator } from "~/main/decorators/log-decorator/log-controller";
import { Controller } from "~/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "~/presentation/protocols/http";

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
  const sut = new LogControllerDecorator(controllerStub);

  return { sut, controllerStub };
};

describe("LogControllerDecorator", () => {
  it("should call controller handle", async () => {
    // given
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
      },
    };

    // when
    await sut.handle(httpRequest);
    expect(handleSpy).toBeCalledWith(httpRequest);
  });
});
