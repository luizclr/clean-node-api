import { Knex } from "knex";

export const staticConnection = {
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  ssl: false,
};

const knexConfig: Record<string, Knex.Config> = {
  development: {
    client: "pg",
    connection: staticConnection,
    migrations: {
      tableName: "knex_migrations",
      directory: `${__dirname}/database/migrations`,
    },
    seeds: {
      directory: `${__dirname}/database/seeds`,
    },
  },
  production: {},
};

export default knexConfig;
