import { Order } from "../entities/Order";
import { Product } from "../entities/Product";

export interface CheckoutGateway {
  checkout(order: Order): Promise<any>;
  getProducts(): Promise<Product[]>;
}