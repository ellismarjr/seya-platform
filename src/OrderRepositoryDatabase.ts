import pgPromise from "pg-promise";
import { OrderRepository } from "./OrderRepository";
import { Order } from "./Order";
import { DatabaseConnection } from "./DatabaseConnection";

export class OrderRepositoryDatabase implements OrderRepository {
  constructor(readonly connection: DatabaseConnection) { }

  async get(id_order: string): Promise<Order> {
    const [orderData] = await this.connection.query('SELECT * FROM cccat11.order WHERE id_order = $1', [id_order]);
    return orderData;
  }

  async save(order: Order): Promise<void> {
    await this.connection.query("INSERT INTO cccat11.order (id_order, code, cpf, total, freight) values ($1, $2, $3, $4, $5 )",
      [order.idOrder, order.code, order.cpf, order.getTotal(), order.freight]);
  }

  async clear(): Promise<void> {
    await this.connection.query("DELETE FROM cccat11.order", []);
  }

  async count(): Promise<number> {
    const [data] = await this.connection.query("SELECT COUNT(*)::integer FROM cccat11.order", []);
    return data.count
  }

}