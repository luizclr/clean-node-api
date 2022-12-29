import { newDb } from "pg-mem";
import { Knex } from "knex";

export class PostgresHelper {
  private knex: Knex;

  public async connect(): Promise<void> {
    const db = newDb();

    // await this.knex.get
    this.knex = (await db.adapters.createKnex()) as Knex;
  }

  public async disconect(): Promise<void> {
    await this.knex.destroy();
  }
}
