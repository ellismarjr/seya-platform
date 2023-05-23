import { Presenter } from "../../infra/presenter/Presenter";
import { ProductRepository } from "../repository/ProductRepository";
import { RepositoryFactory } from "../factory/RepositoryFactory";

export class GetProducts {
  productRepository: ProductRepository;

  constructor(
    repositoryFactory: RepositoryFactory,
    readonly presenter: Presenter
  ) {
    this.productRepository = repositoryFactory.createProductRepository();
  }

  async execute(): Promise<any> {
    const products = await this.productRepository.list();
    const output: Output[] = [];
    for (const product of products) {
      output.push({
        idProduct: product.idProduct,
        description: product.description,
        price: product.price
      });
    }
    return this.presenter.present(output);
  }
}

type Items = {
  idProduct: number;
  quantity: number;
}

type Input = {
  items: Items[];
  from?: string;
  to?: string;
}

type Output = {
  idProduct: number;
  description: string;
  price: number;
}