/* eslint-disable no-console */
import knexInstance from "~/main/config/knex";

async function runMigrations(): Promise<void> {
  try {
    await knexInstance.migrate.latest();
    console.log("Migrations: Done!");
  } catch (error: unknown) {
    console.error("Error during migrations:", error);
    throw error;
  }
}

export async function databaseSetup(): Promise<void> {
  if (JSON.parse(process.env.MEM_TEST)) return;

  try {
    await runMigrations();
  } catch (error: unknown) {
    console.error("Error during database setup:", error);
    throw error;
  }
}
