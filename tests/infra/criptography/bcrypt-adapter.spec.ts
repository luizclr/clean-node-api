import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import { BcryptAdapter } from "~/infra/cryptography/bcrypt-adapter";

const password = faker.internet.password();
const hashedPassword = faker.string.alphanumeric(20);

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return Promise.resolve(hashedPassword);
  },
  async compare(): Promise<boolean> {
    return Promise.resolve(true);
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe("Bcrypt Adapter", () => {
  describe("hash", () => {
    it("should call hash with correct values", async () => {
      // given;
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, "hash");
      const password = faker.internet.password();

      // when
      await sut.hash(password);

      //then
      expect(hashSpy).toHaveBeenCalledWith(password, salt);
    });

    it("should return a valid hash on hash success", async () => {
      // given;
      const sut = makeSut();
      const password = faker.internet.password();

      // when
      const returnedHashedPassword = await sut.hash(password);

      //then
      expect(returnedHashedPassword).toBe(hashedPassword);
    });
  });

  describe("compare", () => {
    it("should call compare with correct values", async () => {
      // given;
      const sut = makeSut();
      const compareSpy = jest.spyOn(bcrypt, "compare");

      // when
      await sut.compare(password, hashedPassword);

      //then
      expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
    });

    it("should return true when compare succeeds", async () => {
      // given;
      const sut = makeSut();

      // when
      const isValid = await sut.compare(password, hashedPassword);

      //then
      expect(isValid).toBe(true);
    });

    it("should return false when compare fails", async () => {
      // given;
      const sut = makeSut();
      jest
        .spyOn(bcrypt, "compare")
        .mockImplementationOnce(() => Promise.resolve(false));

      // when
      const isValid = await sut.compare(password, hashedPassword);

      //then
      expect(isValid).toBe(false);
    });

    it("should throw if compare throws", async () => {
      // given;
      const sut = makeSut();
      jest
        .spyOn(bcrypt, "compare")
        .mockImplementationOnce(() => Promise.reject(new Error()));

      // when
      const promise = sut.compare(password, hashedPassword);

      //then
      expect(promise).rejects.toThrow();
    });
  });
});
