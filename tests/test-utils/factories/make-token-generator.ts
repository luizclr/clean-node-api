import { TokenGenerator } from "~/data/protocols/cryptography/token-generator";

export const makeTokenGenerator = (token: string): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(_id: string): Promise<string> {
      return token;
    }
  }

  return new TokenGeneratorStub();
};
