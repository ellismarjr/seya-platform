import { ProductRepository } from "./ProductRepository";

export class SimulateFreight {
  constructor(readonly productRepository: ProductRepository) { }

  async execute(input: Input): Promise<Output> {
    const output = {
      freight: 0,
    }
    for (const item of input.items) {
      if (input.from && input.to) {
        const productData = await this.productRepository.get(item.idProduct);
        const volume = productData.width / 100 * productData.height / 100 * productData.length / 100;
        const density = productData.weight / volume;
        let freight = volume * 1000 * (density / 100);
        freight = Math.max(freight, 10);
        output.freight += freight * item.quantity;
      }
    }

    return output;
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
  freight: number;
}