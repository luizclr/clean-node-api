import { Encrypter } from "~/data/protocols/cryptography/encrypter";

export const makeEncrypter = (token: string): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(_value: string): Promise<string> {
      return token;
    }
  }

  return new EncrypterStub();
};
