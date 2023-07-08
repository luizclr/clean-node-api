import { Authentication } from "~/domain/use-cases/authentication/authentication";

export const makeAuthentication = (token: string): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(_email: string, _password: string): Promise<string> {
      return token;
    }
  }

  return new AuthenticationStub();
};
