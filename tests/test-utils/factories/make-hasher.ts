import { Hasher } from "~/data/protocols/cryptography/hasher";

export const makeHasherStub = (hashedPassword): Hasher => {
  class HasherStub implements Hasher {
    hash(_value: string): Promise<string> {
      return Promise.resolve(hashedPassword);
    }
  }

  return new HasherStub();
};
