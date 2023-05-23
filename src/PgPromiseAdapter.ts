import pgPromise from "pg-promise";
import { DatabaseConnection } from "./DatabaseConnection";

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any;

  async connect(): Promise<void> {
    this.connection = pgPromise()("postgres://postgres:123456@localhost:5432/app");
  }

  async query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }

}