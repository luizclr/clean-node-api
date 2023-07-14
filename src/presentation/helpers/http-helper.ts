import { StatusCodes } from "http-status-codes";

import { ServerError, UnauthorizedError } from "~/presentation/errors";
import { NotFoundError } from "~/presentation/errors/not-found-error";
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

export const notFound = (message?: string): HttpResponse => ({
  statusCode: StatusCodes.NOT_FOUND,
  body: new NotFoundError(message),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: StatusCodes.OK,
  body: data,
});

export const conflict = (error: Error): HttpResponse => ({
  statusCode: StatusCodes.CONFLICT,
  body: error,
});
