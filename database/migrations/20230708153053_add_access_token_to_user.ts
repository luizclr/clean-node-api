import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("accounts", (table) => {
    table.string("accessToken");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("accounts", (table) => {
    table.dropColumn("accessToken");
  });
}
