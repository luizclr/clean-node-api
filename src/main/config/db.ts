/* eslint-disable no-console */
import { Client } from "pg";

import knexInstance from "~/main/config/knex";

import { staticConnection } from "~/../knexfile";

async function createDatabase(): Promise<void> {
  const client = new Client(staticConnection);

  try {
    await client.connect();
    await client.end();
    console.log("Database Connection: OK!");
  } catch (error: unknown) {
    await client.end();
    console.error("Error during create test database:", error);
    throw error;
  }
}

async function runMigrations(): Promise<void> {
  try {
    const migrations = await knexInstance.select().from("knex_migrations");
    if (!migrations.length) {
      await knexInstance.migrate.latest();
      console.log("Migrations: Done!");
    }
  } catch (error: unknown) {
    console.error("Error during migrations:", error);
    throw error;
  }
}

export async function databaseSetup(): Promise<void> {
  if (JSON.parse(process.env.MEM_TEST)) return;

  try {
    await createDatabase();
    await runMigrations();
  } catch (error: unknown) {
    console.error("Error during database setup:", error);
    throw error;
  }
}
