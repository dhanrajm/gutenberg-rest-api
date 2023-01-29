import KnexModule, { Knex } from "knex";
import { Model } from "objection";
import config from "../config";

/**
 * Database class for connection to postgres instance
 */
export default class DB {
  static knex: Knex<any, unknown[]> | null = null;
  async init(): Promise<void> {
    DB.knex = KnexModule({
      client: "postgres",
      useNullAsDefault: true,
      connection: config.db.connectionUri,
    });
    // Give the knex instance to objection.
    Model.knex(DB.knex);
  }
}

export { DB, Model };
