import { Authentication } from "~/domain/use-cases/authentication/authentication";
import { AuthResponse } from "~/domain/use-cases/authentication/types";
import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { HashComparer } from "~/data/protocols/cryptography/hash-comparer";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth(email: string, password: string): Promise<AuthResponse> {
    const account = await this.getAccountByEmailRepository.get(email);

    const comparison = await this.hashComparer.compare(
      password,
      account.password
    );
    if (!comparison) return null;

    return {
      accessToken: "",
    };
  }
}
