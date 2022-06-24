import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { BcryptAdapter } from "../../../src/infra/criptography/bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return Promise.resolve("hash");
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe("Bcrypt Adapter", () => {
  it("should call bcrypt with correct values", async () => {
    // given;
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const password = faker.internet.password();

    // when
    await sut.encrypt(password);

    //then
    expect(hashSpy).toHaveBeenCalledWith(password, salt);
  });

  it("should return a hash on success", async () => {
    // given;
    const sut = makeSut();
    const password = faker.internet.password();

    // when
    const hashedPassword = await sut.encrypt(password);

    //then
    expect(hashedPassword).toBe("hash");
  });
});
