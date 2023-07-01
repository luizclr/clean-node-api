import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable("accounts", (table: Knex.CreateTableBuilder) => {
      table
        .uuid("id", { primaryKey: true, useBinaryUuid: true })
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.text("name").notNullable();
      table.text("email").notNullable();
      table.text("password").notNullable();

      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("accounts");
}
