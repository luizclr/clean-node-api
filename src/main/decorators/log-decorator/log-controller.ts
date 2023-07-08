import { StatusCodes } from "http-status-codes";

import { LogErrorRepository } from "~/data/protocols/db/log-error-repository";
import { Controller } from "~/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "~/presentation/protocols/http";

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(httpRequest);

    if (response.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
      await this.logErrorRepository.logError(response.body.stack);
    }

    return response;
  }
}
