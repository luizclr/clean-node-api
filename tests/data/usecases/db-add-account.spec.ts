import { faker } from "@faker-js/faker";
import { AddAccountRepository } from "~/data/protocols/add-account-repository";
import { Encrypter } from "~/data/protocols/encrypter";
import { DbAddAccount } from "~/data/usecases/db-add-account";
import { Account, AddAccountModel } from "~/domain/entities/account";

class EncrypterStub implements Encrypter {
  encrypt(_value: string): Promise<string> {
    return Promise.resolve("hashed_password");
  }
}

class AddAccountRepositoryStub implements AddAccountRepository {
  async add({ name, email }: AddAccountModel): Promise<Account> {
    const account: Account = {
      id: "id",
      name,
      email,
      password: "hashed_password",
    };

    return Promise.resolve(account);
  }
}

type SutTypes = {
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
  sut: DbAddAccount;
};

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub();
  const addAccountRepositoryStub = new AddAccountRepositoryStub();

  return {
    encrypterStub,
    addAccountRepositoryStub,
    sut: new DbAddAccount(encrypterStub, addAccountRepositoryStub),
  };
};

describe("DbAddAccount use case", () => {
  it("should call Encrypter with correct password", () => {
    // given
    const { encrypterStub, sut } = makeSut();
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

  it("should throw if Encrypter throws an error", () => {
    // given
    const { encrypterStub, sut } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
    const accountData: AddAccountModel = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // when
    const promise = sut.add(accountData);

    // then
    expect(promise).rejects.toThrow();
  });

  it("should call AddAccountRepository with correct values", async () => {
    // given
    const { addAccountRepositoryStub, sut } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const password = faker.internet.password();
    const accountData: AddAccountModel = {
      name: "name",
      email: "email@email.com",
      password,
    };

    // when
    await sut.add(accountData);

    // then
    expect(addSpy).toHaveBeenCalledWith({
      name: "name",
      email: "email@email.com",
      password: "hashed_password",
    });
  });

  it("should throw if AddAccountRepository throws an error", () => {
    // given
    const { addAccountRepositoryStub, sut } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockRejectedValueOnce(new Error());
    const accountData: AddAccountModel = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // when
    const promise = sut.add(accountData);

    // then
    expect(promise).rejects.toThrow();
  });

  it("should return an Account if success", async () => {
    // given
    const { sut } = makeSut();
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const accountData: AddAccountModel = {
      name,
      email,
      password: faker.internet.password(),
    };

    // when
    const account = await sut.add(accountData);

    // then
    expect(account).toEqual({
      id: "id",
      name,
      email,
      password: "hashed_password",
    });
  });
});
