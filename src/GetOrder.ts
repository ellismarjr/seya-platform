import { OrderRepository } from "./OrderRepository";
import { OrderRepositoryDatabase } from "./OrderRepositoryDatabase";

export class GetOrder {
  constructor(
    readonly orderRepository: OrderRepository = new OrderRepositoryDatabase(),
  ) { }

  async execute(idOrder: string): Promise<Output> {
    const orderData = await this.orderRepository.get(idOrder);
    console.log("🚀 ~ file: GetOrder.ts:11 ~ GetOrder ~ execute ~ orderData:", orderData)
    orderData.total = parseFloat(orderData.total);
    return orderData;
  }
}

type Output = {
  code: string;
  total: number;
}