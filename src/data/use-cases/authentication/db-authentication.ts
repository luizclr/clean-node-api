import { Authentication } from "~/domain/use-cases/authentication/authentication";
import { GetAccountByEmailRepository } from "~/data/protocols/db/get-account-by-email-repository";
import { HashComparer } from "~/data/protocols/cryptography/hash-comparer";
import { Encrypter } from "~/data/protocols/cryptography/encrypter";
import { UpdateAccessTokenRepository } from "~/data/protocols/db/update-access-token-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(email: string, password: string): Promise<string> {
    const account = await this.getAccountByEmailRepository.getByEmail(email);
    if (!account) return null;

    const comparison = await this.hashComparer.compare(
      password,
      account.password
    );
    if (!comparison) return null;

    const accessToken = await this.encrypter.encrypt(account.id);
    if (!accessToken) return null;

    await this.updateAccessTokenRepository.updateToken(account.id, accessToken);

    return accessToken;
  }
}
