import jwt from "jsonwebtoken";

import { Encrypter } from "~/data/protocols/cryptography/encrypter";

export class JWTAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  encrypt(value: Record<string, unknown>): Promise<string> {
    const newJwt = jwt.sign(value, this.secret);
    return Promise.resolve(newJwt);
  }
}
