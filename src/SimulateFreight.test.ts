import { describe, expect, it } from "vitest";
import { ProductRepositoryDatabase } from "./ProductRepositoryDatabase";
import { SimulateFreight } from "./SimulateFreight";
import { DatabaseRepositoryFactory } from "./DatabaseRepositoryFactory";

describe('SimulateFreight', () => {
  it('should be able to simulate freight and return freight for a order', async () => {
    const input = {
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ],
      from: '88015600',
      to: "22030060"
    }
    const repositorFactory = new DatabaseRepositoryFactory();
    const simulateFreight = new SimulateFreight(repositorFactory);
    const output = await simulateFreight.execute(input);
    expect(output.freight).toBe(280);
  })
});