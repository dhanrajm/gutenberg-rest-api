import { Knex } from "knex";
import { Model } from "objection";
/**
 * Database class for connection to postgres instance
 */
export default class DB {
    static knex: Knex<any, unknown[]> | null;
    init(): Promise<void>;
}
export { DB, Model };
