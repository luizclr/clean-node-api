import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table: Knex.CreateTableBuilder) => {
    table.uuid("id").primary().notNullable();
    table.text("name").notNullable();
    table.text("email").notNullable();
    table.text("password").notNullable();

    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
