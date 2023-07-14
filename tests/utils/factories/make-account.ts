import { faker } from "@faker-js/faker";

import { Account } from "~/domain/entities/account";

export const makeAccount = (
  id = faker.string.uuid(),
  name = faker.person.firstName(),
  email = faker.internet.email()
): Account => {
  const account = { id, name, email };

  return account;
};
