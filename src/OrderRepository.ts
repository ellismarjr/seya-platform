import { Order } from "./Order";

export interface OrderRepository {
  get(idOrder: string): Promise<any>;
  save(order: Order): Promise<void>;
  clear(): Promise<void>;
  count(): Promise<number>;
}