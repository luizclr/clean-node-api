import { faker } from "@faker-js/faker";

import { AddAccountModel } from "~/domain/entities/account";

export const makeAddAccountModel = (): AddAccountModel => ({
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});
