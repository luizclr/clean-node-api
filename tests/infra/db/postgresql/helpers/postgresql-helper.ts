import { DataType, newDb } from "pg-mem";
import { Knex } from "knex";

import knexConfig from "~/../knexfile";
import { faker } from "@faker-js/faker";

const pgMem = newDb();
pgMem.registerExtension("uuid-ossp", (schema) => {
  schema.registerFunction({
    name: "uuid_generate_v4",
    returns: DataType.uuid,
    implementation: faker.string.uuid,
    impure: true,
  });
});

const knexMem = pgMem.adapters.createKnex(0, knexConfig.development) as Knex;

export { pgMem, knexMem };
