import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("errors", (table: Knex.CreateTableBuilder) => {
    table
      .uuid("id", { primaryKey: true, useBinaryUuid: true })
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.text("stack").notNullable();

    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("errors");
}
