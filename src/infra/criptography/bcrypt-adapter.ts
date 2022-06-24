import bcrypt from "bcrypt";
import { Encrypter } from "../../data/protocols/encrypter";

export class BcryptAdapter implements Encrypter {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  encrypt(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }
}
