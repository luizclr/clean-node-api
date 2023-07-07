import { Encrypter } from "~/data/protocols/cryptography/encrypter";

export const makeEncrypterStub = (hashedPassword): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt(_value: string): Promise<string> {
      return Promise.resolve(hashedPassword);
    }
  }

  return new EncrypterStub();
};
