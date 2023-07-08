import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";

import { JWTAdapter } from "~/infra/cryptography/jwt-adapter/jwt-adapter";

const id = faker.string.uuid();
const payload = { id };
const fakeJwt = faker.string.alphanumeric(20);
const secret = faker.string.alphanumeric(20);

jest.mock("jsonwebtoken", () => ({
  sign(): string {
    return fakeJwt;
  },
}));

const makeSut = (): JWTAdapter => {
  const sut = new JWTAdapter(secret);

  return sut;
};

describe("JWT Adapter", () => {
  describe("sigh", () => {
    it("should call sign with correct values", async () => {
      // given
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, "sign");

      // when
      await sut.encrypt(payload);

      // then
      expect(signSpy).toHaveBeenCalledWith(payload, secret);
    });

    it("should return a token on sign succeeds", async () => {
      // given
      const sut = makeSut();

      // when
      const accessToken = await await sut.encrypt(payload);

      // then
      expect(accessToken).toBe(fakeJwt);
    });

    it("should throw if sign throws", async () => {
      // given
      const sut = makeSut();
      jest
        .spyOn(jwt, "sign")
        .mockImplementationOnce(() => Promise.reject(new Error()));

      // when
      const promise = sut.encrypt(payload);

      // then
      await expect(promise).rejects.toThrow();
    });
  });
});
