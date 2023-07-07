import bcrypt from "bcrypt";

import { Hasher } from "~/data/protocols/cryptography/hasher";

export class BcryptAdapter implements Hasher {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }
}
