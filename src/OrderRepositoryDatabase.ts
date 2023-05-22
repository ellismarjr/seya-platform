import pgPromise from "pg-promise";
import { OrderRepository } from "./OrderRepository";
import { Order } from "./Order";

export class OrderRepositoryDatabase implements OrderRepository {
  async get(id_order: string): Promise<Order> {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
    const [orderData] = await connection.query('SELECT * FROM cccat11.order WHERE id_order = $1', [id_order]);
    await connection.$pool.end();
    return orderData;
  }

  async save(order: Order): Promise<void> {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
    await connection.query("INSERT INTO cccat11.order (id_order, code, cpf, total, freight) values ($1, $2, $3, $4, $5 )",
      [order.idOrder, order.code, order.cpf, order.getTotal(), order.freight]);
    await connection.$pool.end();
  }

  async clear(): Promise<void> {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
    await connection.query("DELETE FROM cccat11.order");
    await connection.$pool.end();
  }

  async count(): Promise<number> {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
    const [data] = await connection.query("SELECT COUNT(*)::integer FROM cccat11.order", []);
    await connection.$pool.end();
    return data.count
  }

}