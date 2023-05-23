import { Product } from "../../domain/entities/Product";

export interface ProductRepository {
  get(idProduct: number): Promise<Product>;
  list(): Promise<Product[]>;
}