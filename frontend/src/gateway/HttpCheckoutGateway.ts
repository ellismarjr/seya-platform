import { CheckoutGateway } from "./CheckoutGateway";
import { Order } from '../entities/Order';
import { Product } from '../entities/Product';
import { HttpClient } from '../http/HttpClient';

export class HttpCheckoutGateway implements CheckoutGateway {
  constructor(readonly httpClient: HttpClient) { }

  async checkout(order: Order): Promise<any> {
    return this.httpClient.post('http://localhost:3333/checkout', order);
  }

  async getProducts(): Promise<Product[]> {
    const productsData = await this.httpClient.get('http://localhost:3333/products');
    const products: Product[] = [];
    for (const productData of productsData) {
      products.push(new Product(productData.idProduct, productData.description, productData.price));
    }
    return products;
  }
}