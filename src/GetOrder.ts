import { OrderRepository } from "./OrderRepository";
import { OrderRepositoryDatabase } from "./OrderRepositoryDatabase";
import { RepositoryFactory } from "./RepositoryFactory";

export class GetOrder {
  orderRepository: OrderRepository;

  constructor(
    repositoryFactory: RepositoryFactory
  ) {
    this.orderRepository = repositoryFactory.createOrderRepository();
  }

  async execute(idOrder: string): Promise<Output> {
    const orderData = await this.orderRepository.get(idOrder);
    orderData.total = parseFloat(orderData.total);
    return orderData;
  }
}

type Output = {
  code: string;
  total: number;
}