import { Knex, knex } from "knex";

import { knexMem } from "#/infra/db/postgresql/helpers/postgresql-helper";

import knexConfig from "~/../knexfile";

const getKnexInstance = (): Knex => {
  if (JSON.parse(process.env.MEM_TEST)) return knexMem;
  if (process.env.NODE_ENV === "production") return knex(knexConfig.production);
  return knex(knexConfig.development);
};

const knexInstance = getKnexInstance();

export default knexInstance;
