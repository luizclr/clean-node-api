import { HashComparer } from "~/data/protocols/cryptography/hash-comparer";

export const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(_value: string, _hash: string): Promise<boolean> {
      return true;
    }
  }

  return new HashComparerStub();
};
