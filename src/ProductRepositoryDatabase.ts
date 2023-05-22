import pgPromise from "pg-promise";
import { ProductRepository } from "./ProductRepository";
import { Product } from "./Product";

export class ProductRepositoryDatabase implements ProductRepository {
  async get(idProduct: number) {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
    const [productData] = await connection.query('SELECT * FROM cccat11.product WHERE id_product = $1', idProduct);
    await connection.$pool.end();
    return new Product(productData.id_product, productData.description, parseFloat(productData.price), productData.width, productData.height, productData.length, parseFloat(productData.weight));
  }
}