import { Checkout } from "./Checkout";
import { CsvPresenter } from "./CsvPresenter";
import { GetProducts } from "./GetProducts";
import { JsonPresenter } from "./JsonPresenter";
import { Presenter } from "./Presenter";
import { RepositoryFactory } from "./RepositoryFactory";

export class UseCaseFactory {
  constructor(
    readonly repositoryFactory: RepositoryFactory,
  ) { }

  createCheckout() {
    return new Checkout(this.repositoryFactory);
  }

  createGetProducts(type: string) {
    let presenter;
    if (type === 'application/json') {
      presenter = new JsonPresenter();
    }
    if (type === 'text/csv') {
      presenter = new CsvPresenter();
    }
    if (!presenter) throw new Error('Invalids content type');
    return new GetProducts(this.repositoryFactory, presenter);
  }
}