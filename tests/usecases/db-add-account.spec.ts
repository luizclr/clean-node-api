import { faker } from "@faker-js/faker";
import { Encrypter } from "../../src/data/protocols/encrypter";
import { DbAddAccount } from "../../src/data/usecases/db-add-account";
import { AddAccountModel } from "../../src/domain/use-cases/add-account";

class EncrypterStub implements Encrypter {
  encrypt(_value: string): Promise<string> {
    return Promise.resolve("hashed_password");
  }
}

describe("DbAddAccount use case", () => {
  it("should call Encrypter with correct password", () => {
    // given
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const password = faker.internet.password();
    const accountData: AddAccountModel = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
    };

    // when
    sut.add(accountData);

    // then
    expect(encryptSpy).toHaveBeenCalledWith(password);
  });

  it("should throw if Encrypter thowa an error", () => {
    // given
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
    const password = faker.internet.password();
    const accountData: AddAccountModel = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
    };

    // when
    const promise = sut.add(accountData);

    // then
    expect(promise).rejects.toThrow();
  });
});
