import { Authentication } from "~/domain/use-cases/authentication/authentication";
import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { HashComparer } from "~/data/protocols/cryptography/hash-comparer";
import { TokenGenerator } from "~/data/protocols/cryptography/token-generator";
import { UpdateAccessTokenRepository } from "~/data/protocols/db/update-access-token-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(email: string, password: string): Promise<string> {
    const account = await this.getAccountByEmailRepository.get(email);
    if (!account) return null;

    const comparison = await this.hashComparer.compare(
      password,
      account.password
    );
    if (!comparison) return null;

    const accessToken = await this.tokenGenerator.generate(account.id);
    if (!accessToken) return null;

    await this.updateAccessTokenRepository.update(account.id, accessToken);

    return accessToken;
  }
}
