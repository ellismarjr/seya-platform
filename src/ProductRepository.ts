import { Product } from "./Product";

export interface ProductRepository {
  get(idProduct: number): Promise<Product>;
  list(): Promise<Product[]>;
}