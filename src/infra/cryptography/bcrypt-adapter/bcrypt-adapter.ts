import bcrypt from "bcrypt";

import { Hasher } from "~/data/protocols/cryptography/hasher";
import { HashComparer } from "~/data/protocols/cryptography/hash-comparer";

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }
}
