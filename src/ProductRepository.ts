export interface ProductRepository {
  get(idProduct: number): Promise<any>;
}