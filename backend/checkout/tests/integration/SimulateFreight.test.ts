import { afterEach, describe, expect, it } from "vitest";
import { SimulateFreight } from "../../src/application/usecase/SimulateFreight";
import { DatabaseRepositoryFactory } from "../../src/infra/factory/DatabaseRepositoryFactory";
import { PgPromiseAdapter } from "../../src/infra/database/PgPromiseAdapter";

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
    const connection = new PgPromiseAdapter();
    await connection.connect();
    const repositorFactory = new DatabaseRepositoryFactory(connection);
    const simulateFreight = new SimulateFreight(repositorFactory);
    const output = await simulateFreight.execute(input);
    expect(output.freight).toBe(280);
    await connection.close();
  })
});