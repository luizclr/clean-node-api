import { StatusCodes } from "http-status-codes";
import { ServerError } from "~/presentation/errors";
import { HttpResponse } from "~/presentation/protocols/http";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: StatusCodes.BAD_REQUEST,
  body: error,
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  body: new ServerError(error.stack),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: StatusCodes.OK,
  body: data,
});

export const accountAlreadyExist = (): HttpResponse => ({
  statusCode: StatusCodes.CONFLICT,
  body: {
    errorMessage: "E-mail already in use",
  },
});
