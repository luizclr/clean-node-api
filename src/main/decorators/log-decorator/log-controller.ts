import { StatusCodes } from "http-status-codes";
import { Controller } from "~/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "~/presentation/protocols/http";

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(httpRequest);
    if (response.statusCode === StatusCodes.BAD_REQUEST) {
      console.error(`${response.statusCode} => ${response.body}`);
    }

    return response;
  }
}
