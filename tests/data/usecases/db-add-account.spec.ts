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
    const account: Account = { id: "id", name, email };

    return Promise.resolve(account);
  }
}

type SutTypes = {
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
  sut: DbAddAccount;
};

const makeAddAccountModel = (): AddAccountModel => ({
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

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
  it("should call Encrypter with correct password", async () => {
    // given
    const { encrypterStub, sut } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = makeAddAccountModel();

    // when
    await sut.add(accountData);

    // then
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
  });

  it("should throw if Encrypter throws an error", () => {
    // given
    const { encrypterStub, sut } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
    const accountData = makeAddAccountModel();

    // when
    const promise = sut.add(accountData);

    // then
    expect(promise).rejects.toThrow();
  });

  it("should call AddAccountRepository with correct values", async () => {
    // given
    const { addAccountRepositoryStub, sut } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const { name, email, password } = makeAddAccountModel();

    // when
    await sut.add({ name, email, password });

    // then
    expect(addSpy).toHaveBeenCalledWith({
      name,
      email,
      password: "hashed_password",
    });
  });

  it("should throw if AddAccountRepository throws an error", () => {
    // given
    const { addAccountRepositoryStub, sut } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockRejectedValueOnce(new Error());
    const accountData = makeAddAccountModel();

    // when
    const promise = sut.add(accountData);

    // then
    expect(promise).rejects.toThrow();
  });

  it("should return an Account if success", async () => {
    // given
    const { sut } = makeSut();
    const { name, email, password } = makeAddAccountModel();

    // when
    const account = await sut.add({ name, email, password });

    // then
    expect(account).toEqual({ id: "id", name, email });
  });
});
