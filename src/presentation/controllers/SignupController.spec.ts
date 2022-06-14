import { StatusCodes } from "http-status-codes";
import MissingParamError from "../errors/MissingParamError";
import { HttpRequest, HttpResponse } from "../protocols/http";
import SignupController from "./SignupController";

const makeSut = (): SignupController => new SignupController();

describe("Signup Controller", () => {
  it("should return 400 if no name is not provided", () => {
    const sut = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password",
      }
    }

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  it("should return 400 if no e-mail is not provided", () => {
    const sut = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        password: "password",
        passwordConfirmation: "password",
      }
    }

    const httpResponse: HttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  it("should return 400 if password is not provided", () => {
    const sut = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        passwordConfirmation: "password",
      }
    }

    const httpResponse: HttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  it("should return 400 if password confirmation is not provided", () => {
    const sut = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
      }
    }

    const httpResponse: HttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"));
  });
});
