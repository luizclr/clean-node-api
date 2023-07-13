import { StatusCodes } from "http-status-codes";

import { ServerError, UnauthorizedError } from "~/presentation/errors";
import { HttpResponse } from "~/presentation/protocols/http";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: StatusCodes.BAD_REQUEST,
  body: error,
});

export const serverError = (error: ServerError): HttpResponse => ({
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  body: error,
});

export const unauthorized = (message?: string): HttpResponse => ({
  statusCode: StatusCodes.UNAUTHORIZED,
  body: new UnauthorizedError(message),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: StatusCodes.OK,
  body: data,
});

export const conflict = (error: Error): HttpResponse => ({
  statusCode: StatusCodes.CONFLICT,
  body: error,
});
