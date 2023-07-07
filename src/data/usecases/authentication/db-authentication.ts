import { Authentication } from "~/domain/use-cases/authentication/authentication";
import { AuthResponse } from "~/domain/use-cases/authentication/types";
import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository
  ) {}

  async auth(email: string, _password: string): Promise<AuthResponse> {
    await this.getAccountByEmailRepository.get(email);
    return null;
  }
}
